// GET /api/v1/orders/my-orders
import { db } from "@/index";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getUserById } from "@/data/users";
import { corsHeaders } from "@/lib/cors";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Usuario no autenticado (Falta token)" },
                { status: 401, headers: corsHeaders }
            );
        }

        const user = await verifyToken(token);
        if (!user || !user.sub) {
            return NextResponse.json(
                { error: "Token inválido o expirado" },
                { status: 401, headers: corsHeaders }
            );
        }

        const dbUser = await getUserById(user.sub);
        if (!dbUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404, headers: corsHeaders }
            );
        }

        const userOrdersHistory = await db.query.orders.findMany({
            where: eq(orders.userId, dbUser.id),
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],

            with: {
                estadoPedido: true,
                orderItems: {
                    with: {
                        product: true,
                        exclusiones: true,
                    },
                },
            },
        });

        return NextResponse.json(
            { ordersHistory: userOrdersHistory },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error("[MY_ORDERS_GET_ERROR]", error);
        return NextResponse.json(
            { error: "Error interno del servidor al obtener el historial de pedidos" },
            { status: 500, headers: corsHeaders }
        );
    }
}