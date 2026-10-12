import { NextResponse } from "next/server";
import { db } from "@/index";
import { users, verificationToken } from "@/db/schema"
import { getVerificationTokenByToken } from "@/data/verification-token";
import { getUserByEmail } from "@/data/users";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return NextResponse.json(
                { error: "Token de verificación no proporcionado" },
                { status: 400 }
            );
        }
        const existingToken = await getVerificationTokenByToken(token);

        if (!existingToken) {
            return NextResponse.json(
                { error: "Token de verificación no encontrado" },
                { status: 404 }
            );
        }
        const { email, expires } = existingToken;

        if (new Date(expires) < new Date()) {
            return NextResponse.json(
                { error: "Token de verificación expirado" },
                { status: 410 }
            );
        }

        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }
        const { id } = existingUser;

        await db
            .update(users)
            .set({ emailVerified: new Date(), email: existingToken.email })
            .where(eq(users.id, id));

        await db
            .delete(verificationToken)
            .where(eq(verificationToken.id, existingToken.id));

        return NextResponse.json(
            { message: "Correo electrónico verificado exitosamente" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Error interno del servidor al verificar el correo" },
            { status: 500 }
        );
    }
}
