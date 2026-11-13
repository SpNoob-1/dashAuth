// api para obtener todas las direcciones del usuario logueado
// GET /api/v1/addresses

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index";
import { eq, and } from "drizzle-orm";
import { addresses } from "@/db/schema";
import { corsHeaders } from "@/lib/cors";
import { getUserById } from "@/data/users";
import { verifyToken } from "@/lib/auth";
import { addressSchema } from "@/schemas";

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

        const addressesList = await db.query.addresses.findMany({
            where: and(
                eq(addresses.userId, dbUser.id),
            ),
            with: {
                municipio: true
            },
            orderBy: (addresses, { desc }) => [desc(addresses.createdAt)],
        });

        return NextResponse.json(addressesList, { headers: corsHeaders });
    } catch (error) {
        console.error("[ADDRESES_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
    }
}


// POST /api/v1/addresses
// api para registrar las direcciones del usuario 

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = addressSchema.safeParse(body);

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
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Datos de registro inválidos",
                    details: validation.error.flatten((issue) => issue.message).fieldErrors,
                },
                { status: 400 }
            );
        }

        const { alias, street, isDefault, municipioId, details } = validation.data;

        const [newAddress] = await db
            .insert(addresses)
            .values({
                userId: dbUser.id,
                municipioId: municipioId,
                alias,
                details,
                street,
                isDefault,
            })
            .returning();

        return NextResponse.json(
            { success: "Direccion creada correctamente.", data: newAddress },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error("[ADDRESSE_POST_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}