// app/api/v1/auth/new-password/route.ts (o la ruta que estés usando)
import { NextResponse } from "next/server";
import { NewPasswordSchema } from "@/schemas";
import { hashPassword } from "@/lib/auth";
import { users, passwordResetTokens } from "@/db/schema";
import { getUserByEmail } from "@/data/users";
import { getResetPasswordTokenByToken } from "@/data/reset-password-token"; // <-- Tu helper correcto
import { db } from "@/index";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = NewPasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Datos inválidos",
                    details: validation.error.flatten((issue) => issue.message).fieldErrors,
                },
                { status: 400 }
            );
        }

        const url = new URL(req.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return NextResponse.json(
                { error: "Token de verificación no proporcionado" },
                { status: 400 }
            );
        }

        const { password } = validation.data;

        // Usamos tu helper correcto para buscar el token
        const existingToken = await getResetPasswordTokenByToken(token);

        if (!existingToken) {
            return NextResponse.json(
                { error: "Token de verificación no encontrado" },
                { status: 404 }
            );
        }

        if (new Date(existingToken.expires).getTime() < Date.now()) {
            return NextResponse.json({ error: "Token de recuperación expirado" }, { status: 410 });
        }

        const existingUser = await getUserByEmail(existingToken.email);

        if (!existingUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        const hashedPassword = await hashPassword(password);

        // 1. Actualizar la contraseña del usuario
        await db
            .update(users)
            .set({
                password: hashedPassword,
            })
            .where(eq(users.email, existingToken.email));

        // 2. Borrar el token usado de la base de datos
        await db
            .delete(passwordResetTokens)
            .where(eq(passwordResetTokens.id, existingToken.id));

        return NextResponse.json(
            { message: "Contraseña restablecida exitosamente" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error en reset password:", error);
        return NextResponse.json(
            { error: "Error interno del servidor al restablecer la contraseña" },
            { status: 500 }
        );
    }
}