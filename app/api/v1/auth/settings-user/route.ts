// app/api/v1/auth/settings-user.tsx/route.ts
import { SettingsSchema } from "@/schemas";
import { NextResponse, NextRequest } from "next/server"; // <-- Usar NextRequest
import { comparePassword, hashPassword, verifyToken } from "@/lib/auth"; // <-- Importamos verifyToken
import { db } from "@/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserById, getUserByEmail } from "@/data/users";
import { signToken } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function PATCH(req: NextRequest) { // <-- Cambiado a NextRequest para leer cookies fácilmente
    try {
        const body = await req.json();
        const validation = SettingsSchema.safeParse(body);

        if (!validation.success) {
            console.log("Errores de Zod:", validation.error.format());
            return NextResponse.json(
                {
                    error: "Datos de configuración inválidos",
                    details: validation.error.flatten((issue) => issue.message).fieldErrors,
                },
                { status: 400 }
            );
        }

        // 1. Verificar autenticación leyendo la cookie directamente de la petición entrante
        const token = req.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Usuario no autenticado (Falta token)" },
                { status: 401 }
            );
        }

        const user = await verifyToken(token);
        if (!user || !user.sub) {
            return NextResponse.json(
                { error: "Token inválido o expirado" },
                { status: 401 }
            );
        }

        const dbUser = await getUserById(user.sub);
        if (!dbUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // Estructura de valores a actualizar (Sin la propiedad 'rol')
        const valuesToUpdate: {
            name?: string;
            email?: string;
            password?: string;
        } = {};

        if (validation.data.name) {
            valuesToUpdate.name = validation.data.name;
        }

        let emailVerificationSent = false;

        // 2. Validar cambio de correo y enviar token de verificación
        if (validation.data.email && validation.data.email !== dbUser.email) {
            const existingUser = await getUserByEmail(validation.data.email);

            if (existingUser && existingUser.id !== dbUser.id) {
                return NextResponse.json(
                    { error: "El correo electrónico ya está en uso por otra cuenta" },
                    { status: 409 }
                );
            }

            const verificationToken = await generateVerificationToken(
                validation.data.email
            );

            await sendVerificationEmail(
                verificationToken.email,
                verificationToken.token
            );

            emailVerificationSent = true;
        }

        // 3. Manejar cambio de contraseña
        if (validation.data.password && validation.data.newPassword) {
            if (!dbUser.password) {
                return NextResponse.json(
                    { error: "Esta cuenta utiliza un proveedor externo y no tiene contraseña." },
                    { status: 400 }
                );
            }

            const passwordMatch = await comparePassword(validation.data.password, dbUser.password);
            if (!passwordMatch) {
                return NextResponse.json(
                    { error: "La contraseña actual es incorrecta" },
                    { status: 400 }
                );
            }
            valuesToUpdate.password = await hashPassword(validation.data.newPassword);
        }

        // 4. Actualizar en Base de Datos si hay cambios pendientes (Nombre o Contraseña)
        if (Object.keys(valuesToUpdate).length > 0) {
            await db
                .update(users)
                .set(valuesToUpdate)
                .where(eq(users.id, dbUser.id));
        }

        // 5. Reemitir Token JWT manteniendo el rol original del usuario
        const updatedEmail = dbUser.email;
        const updatedName = valuesToUpdate.name ?? dbUser.name;
        const currentRole = (dbUser.rol ?? "CLIENTE") as "CLIENTE" | "ADMIN";

        const newToken = await signToken({
            sub: dbUser.id.toString(),
            email: updatedEmail,
            rol: currentRole,
            name: updatedName,
        });

        const responseMessage = emailVerificationSent
            ? "¡Correo de verificación enviado! Revisa tu bandeja para confirmar el cambio."
            : "Configuración actualizada exitosamente";

        const response = NextResponse.json(
            {
                message: responseMessage,
                token: newToken,
                user: { id: dbUser.id, email: updatedEmail, role: currentRole, name: updatedName },
            },
            { status: 200 }
        );

        // Actualizar la cookie de sesión con el nuevo token firmado
        response.cookies.set("auth_token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 8,
        });

        return response;

    } catch (error) {
        console.error("Error en PATCH settings:", error);
        return NextResponse.json(
            {
                error: "Error interno del servidor al actualizar la configuración",
            },
            { status: 500 }
        );
    }
}