// lib/tokens.ts
import { db } from "@/index";
import { verificationToken, passwordResetTokens } from "@/db/schema";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getResetPasswordTokenByEmail } from "@/data/reset-password-token";
import { eq } from "drizzle-orm";

/**
 * Genera un nuevo token de verificación para un email dado.
 * Si ya existe un token previo para ese email, lo elimina primero.
 */

export async function generatePasswordResetToken(email: string) {
    const token = crypto.randomUUID();

    // El token expira en 15 minutos
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    // 1. Verificar si ya existía un token previo para este correo
    const existingToken = await getResetPasswordTokenByEmail(email);

    // 2. Si existe, lo borramos para no acumular basura en la BD
    if (existingToken) {
        await db
            .delete(passwordResetTokens)
            .where(eq(passwordResetTokens.id, existingToken.id));
    }

    // 3. Insertamos el nuevo token de verificación
    const [passwordResetToken] = await db
        .insert(passwordResetTokens)
        .values({
            email,
            token,
            expires,
        })
        .returning();

    return passwordResetToken;
}


export async function generateVerificationToken(email: string) {
    const token = crypto.randomUUID();

    // El token expira en 1 hora (3600 segundos * 1000 ms)
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    // 1. Verificar si ya existía un token previo para este correo
    const existingToken = await getVerificationTokenByEmail(email);

    // 2. Si existe, lo borramos para no acumular basura en la BD
    if (existingToken) {
        await db
            .delete(verificationToken)
            .where(eq(verificationToken.id, existingToken.id));
    }

    // 3. Insertamos el nuevo token de verificación
    const [verificationTokenS] = await db
        .insert(verificationToken)
        .values({
            email,
            token,
            expires,
        })
        .returning();

    return verificationTokenS;
}