// PATCH /api/v1/admin/orders/[orderid]/status
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { ordersStates, orders } from "@/db/schema";
import { orderStateSchema } from "@/schemas";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { corsHeaders } from "@/lib/cors";
import { sendOrderReadyEmail } from "@/lib/mail"; // Tu función de correo para pedido listo

// Mapa estricto de transiciones válidas
const VALID_TRANSITIONS: Record<string, string[]> = {
    PENDIENTE: ["EN_PREPARACION", "CANCELADO"],
    EN_PREPARACION: ["LISTO", "CANCELADO"],
    LISTO: ["ENTREGADO", "CANCELADO"],
};

export async function PATCH(
    req: Request,
    props: { params: Promise<{ orderid: string }> }
) {
    try {
        // 1. Autenticación y Autorización (Solo ADMIN)
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: corsHeaders });
        }

        if (user.rol !== "ADMIN") {
            return NextResponse.json({ error: "Acceso denegado" }, { status: 403, headers: corsHeaders });
        }

        // 2. Validar parámetro de ruta y cuerpo de la petición
        const { orderid } = await props.params;
        if (!orderid) {
            return NextResponse.json({ error: "ID del pedido es requerido" }, { status: 400, headers: corsHeaders });
        }

        const body = await req.json();
        const validation = orderStateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Datos de actualización inválidos",
                    details: validation.error.flatten((issue) => issue.message).fieldErrors,
                },
                { status: 400, headers: corsHeaders }
            );
        }

        const { estadoPedidoId } = validation.data;

        // 3. Buscar el pedido actual con su estado y los datos del usuario (para el e-mail)
        const existingOrder = await db.query.orders.findFirst({
            where: eq(orders.id, orderid),
            with: {
                estadoPedido: true,
                user: true,
            },
        });

        if (!existingOrder) {
            return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404, headers: corsHeaders });
        }

        // 4. Verificación previa: ¿El pedido ya está en un estado final e inmutable?
        if (
            existingOrder.estadoPedido.esFinal ||
            existingOrder.estadoPedido.nombre === "ENTREGADO" ||
            existingOrder.estadoPedido.nombre === "CANCELADO"
        ) {
            return NextResponse.json(
                { error: "El pedido está en un estado final e inmutable" },
                { status: 400, headers: corsHeaders }
            );
        }

        // 5. Buscar el nuevo estado en la base de datos
        const targetState = await db.query.ordersStates.findFirst({
            where: eq(ordersStates.id, estadoPedidoId),
        });

        if (!targetState) {
            return NextResponse.json({ error: "El estado destino no existe" }, { status: 404, headers: corsHeaders });
        }

        // Evitar actualización redundante al mismo estado
        if (existingOrder.estadoPedidoId === targetState.id) {
            return NextResponse.json(
                { error: `El pedido ya se encuentra en estado ${targetState.nombre}` },
                { status: 400, headers: corsHeaders }
            );
        }

        // 6. Validar que la transición siga el flujo estricto
        const currentStateName = existingOrder.estadoPedido.nombre;
        const allowedNextStates = VALID_TRANSITIONS[currentStateName] || [];

        if (!allowedNextStates.includes(targetState.nombre)) {
            return NextResponse.json(
                {
                    error: `Transición no permitida: No se puede pasar de ${currentStateName} a ${targetState.nombre}`,
                },
                { status: 400, headers: corsHeaders }
            );
        }

        // 7. Ejecutar la actualización en la base de datos
        const [updatedOrder] = await db
            .update(orders)
            .set({
                estadoPedidoId: targetState.id,
                updatedAt: new Date(),
            })
            .where(eq(orders.id, orderid))
            .returning();

        // 8. Disparar e-mail automático cuando el estado pasa a LISTO (aislado en try/catch)
        if (targetState.nombre === "LISTO" && existingOrder.user?.email) {
            try {
                await sendOrderReadyEmail(existingOrder.user.email, {
                    orderId: existingOrder.id,
                    addressStreet: existingOrder.addressStreet,
                    municipioName: existingOrder.municipioName,
                });
            } catch (emailError) {
                console.error("[ORDER_READY_EMAIL_ERROR]", emailError);
            }
        }

        revalidatePath("/orders");
        return NextResponse.json(
            {
                success: `Orden actualizada a ${targetState.nombre} correctamente.`,
                data: updatedOrder,
            },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error("[STATE_ORDER_PATCH_ERROR]", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500, headers: corsHeaders }
        );
    }
}