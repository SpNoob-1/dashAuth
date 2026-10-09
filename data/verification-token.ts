import { db } from "@/index"; // Tu instancia de Drizzle
import { verificationToken } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Busca un token de verificación en la BD por el valor del token.
 * Se usa cuando el usuario hace clic en el enlace recibido por correo.
 */
export async function getVerificationTokenByToken(token: string) {
    try {
        const [verificationTokenS] = await db
            .select()
            .from(verificationToken)
            .where(eq(verificationToken.token, token))
            .limit(1);
        return verificationTokenS;
    } catch {
        return null;
    }
}

/**
 * Busca un token activo por el email del usuario.
 * Se usa para verificar si el usuario ya tenía un token generado previamente.
 */
export async function getVerificationTokenByEmail(email: string) {
    try {
        const [verificationTokenS] = await db
            .select()
            .from(verificationToken)
            .where(eq(verificationToken.email, email))
            .limit(1);
        return verificationTokenS;
    } catch {
        return null;
    }
}