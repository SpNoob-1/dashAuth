import { db } from "@/index";
import { passwordResetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getResetPasswordTokenByToken(token: string) {
    try {
        const [user] = await db
            .select()
            .from(passwordResetTokens)
            .where(eq(passwordResetTokens.token, token))
            .limit(1);

        return user || null;
    } catch {
        return null;
    }
}

export async function getResetPasswordTokenByEmail(email: string) {
    try {
        const [user] = await db
            .select()
            .from(passwordResetTokens)
            .where(eq(passwordResetTokens.email, email))
            .limit(1);

        return user || null;
    } catch {
        return null;
    }
}

