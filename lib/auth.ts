import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback_secret_key_change_in_production"
);

export interface JWTPayload {
    sub: string; // ID del usuario
    email: string;
    rol: "CLIENTE" | "ADMIN";
}

// 1. Hashing de Contraseñas
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function comparePassword(
    plain: string,
    hashed: string
): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
}

// 2. Generación de Token JWT
export async function signToken(payload: JWTPayload): Promise<string> {
    return new SignJWT({ email: payload.email, rol: payload.rol })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(payload.sub)
        .setIssuedAt()
        .setExpirationTime("8h") // Expira en 8 horas
        .sign(JWT_SECRET);
}

// 3. Verificación de Token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return {
            sub: payload.sub as string,
            email: payload.email as string,
            rol: payload.rol as "CLIENTE" | "ADMIN",
        };
    } catch (error) {
        return null;
    }
}