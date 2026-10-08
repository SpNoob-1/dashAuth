import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

if (!process.env.JWT_SECRET) {
    throw new Error("Falta la variable de entorno JWT_SECRET");
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);


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


export async function getCurrentUser(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    return await verifyToken(token);
}