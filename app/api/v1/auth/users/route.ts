import { db } from "@/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm"; // <-- Necesario para el filtro WHERE
import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth"; // Asegúrate de importar tu función para verificar el JWT

export async function GET(req: NextRequest) {
    try {
        // 1. Extraer el token de la cookie HttpOnly
        const token = req.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "No autorizado: Falta token de sesión" },
                { status: 401 }
            );
        }

        // 2. Verificar y decodificar el token para obtener los datos del usuario (ej. su id)
        const payload = await verifyToken(token);

        if (!payload || !payload.sub) { // Asumiendo que 'sub' o 'id' guarda el ID del usuario en tu JWT
            return NextResponse.json(
                { error: "Token inválido o expirado" },
                { status: 401 }
            );
        }

        // 3. Consultar la base de datos buscando exclusivamente al usuario cuyo ID coincide con el token
        const [currentUser] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
            })
            .from(users)
            .where(eq(users.id, payload.sub))
            .limit(1);

        if (!currentUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // 4. Retornar únicamente la información de ese usuario
        return NextResponse.json({ user: currentUser }, { status: 200 });

    } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
        return NextResponse.json(
            { error: "Error interno del servidor al obtener el perfil" },
            { status: 500 }
        );
    }
}
