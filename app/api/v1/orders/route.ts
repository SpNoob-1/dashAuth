import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { corsHeaders } from "@/lib/cors";
import { getUserById } from "@/data/users";
import { addresses, orders, orderItems, exclusionsDetail, ordersStates, products } from "@/db/schema";
import { db } from "@/index";
import { eq, and, inArray } from "drizzle-orm";
import { sendOrderConfirmationEmail } from "@/lib/mail"; // Tu servicio de correos

// Estructura esperada en el body del POST
interface CheckoutItemPayload {
    productId: string;
    quantity: number;
    exclusions?: string; // Ej. "Sin nueces, sin lactosa"
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { addressId, phone, items } = body as {
            addressId: string;
            phone: string;
            items: CheckoutItemPayload[];
        };

        // 1. Validaciones básicas del payload
        if (!addressId || !items || items.length === 0) {
            return NextResponse.json(
                { error: "Falta la dirección de envío o el carrito está vacío." },
                { status: 400, headers: corsHeaders }
            );
        }

        // 2. Autenticación
        const token = req.cookies.get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401, headers: corsHeaders });
        }

        const user = await verifyToken(token);
        if (!user || !user.sub) {
            return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401, headers: corsHeaders });
        }

        const dbUser = await getUserById(user.sub);
        if (!dbUser) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404, headers: corsHeaders });
        }

        // 3. Verificar que la dirección exista Y pertenezca al usuario logueado
        const userAddress = await db.query.addresses.findFirst({
            where: and(
                eq(addresses.id, addressId),
                eq(addresses.userId, dbUser.id)
            ),
            with: {
                municipio: {
                    with: { departamento: true }
                }
            }
        });

        if (!userAddress) {
            return NextResponse.json(
                { error: "Dirección no válida o no pertenece al usuario." },
                { status: 404, headers: corsHeaders }
            );
        }

        // 4. Obtener el estado inicial PENDIENTE
        const orderStatePendiente = await db.query.ordersStates.findFirst({
            where: eq(ordersStates.nombre, "PENDIENTE")
        });

        if (!orderStatePendiente) {
            return NextResponse.json(
                { error: "Error de configuración: Estado PENDIENTE no encontrado." },
                { status: 500, headers: corsHeaders }
            );
        }

        // 5. Consultar los productos reales desde la BD para congelar su precio oficial
        const productIds = items.map((item) => item.productId);
        const dbProducts = await db.query.products.findMany({
            where: inArray(products.id, productIds)
        });

        // Creamos un mapa rápido id -> producto
        const productMap = new Map(dbProducts.map((p) => [p.id, p]));

        // Validamos que todos los productos enviados existan
        for (const item of items) {
            if (!productMap.has(item.productId)) {
                return NextResponse.json(
                    { error: `El producto con ID ${item.productId} no existe.` },
                    { status: 400, headers: corsHeaders }
                );
            }
        }

        // 6. TRANSACCIÓN EN BASE DE DATOS (Todo o nada)
        const createdOrder = await db.transaction(async (tx) => {
            // A. Insertar la Orden con el Snapshot de la dirección
            const [newOrder] = await tx
                .insert(orders)
                .values({
                    userId: dbUser.id,
                    estadoPedidoId: orderStatePendiente.id,
                    phone: phone || "",
                    addressAlias: userAddress.alias,
                    addressStreet: userAddress.street,
                    addressDetails: userAddress.details,
                    municipioName: `${userAddress.municipio.name}, ${userAddress.municipio.departamento.name}`,
                })
                .returning();

            // B. Insertar cada ítem y sus exclusiones
            for (const item of items) {
                const dbProduct = productMap.get(item.productId)!;

                const [newOrderItem] = await tx
                    .insert(orderItems)
                    .values({
                        orderId: newOrder.id,
                        productId: dbProduct.id,
                        quantity: item.quantity || 1,
                        price: dbProduct.price, // Precio congelado desde la BD
                    })
                    .returning();

                // C. Si el usuario escribió exclusiones para este ítem, guardarlas
                if (item.exclusions && item.exclusions.trim() !== "") {
                    await tx.insert(exclusionsDetail).values({
                        orderItemId: newOrderItem.id,
                        reason: item.exclusions.trim(),
                    });
                }
            }

            return newOrder;
        });

        const emailItems = items.map((item) => {
            const dbProduct = productMap.get(item.productId)!;
            const quantity = item.quantity || 1;
            return {
                productName: dbProduct.name,
                quantity,
                unitPrice: Number(dbProduct.price),
            };
        });

        const total = emailItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

        const emailData = {
            orderId: createdOrder.id,
            total,
            addressStreet: userAddress.street,
            municipioName: `${userAddress.municipio.name}, ${userAddress.municipio.departamento.name}`,
            items: emailItems,
        };

        // 7. Disparar e-mail de Confirmación de Pedido (asíncrono / no bloqueante)
        await sendOrderConfirmationEmail(dbUser.email, emailData);

        return NextResponse.json(
            { success: "Pedido registrado correctamente.", data: createdOrder },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error("[ORDERS_POST_ERROR]", error);
        return NextResponse.json(
            { error: "Error interno al procesar el pedido." },
            { status: 500, headers: corsHeaders }
        );
    }
}