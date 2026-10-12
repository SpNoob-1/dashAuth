// app/api/v1/auth/register/route.ts
import { NextResponse } from "next/server";
import { db } from "@/index";
import { users } from "@/db/schema"
import { hashPassword } from "@/lib/auth";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/users";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = RegisterSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Datos de registro inválidos",
                    details: validation.error.flatten((issue) => issue.message).fieldErrors,
                },
                { status: 400 }
            );
        }

        const { name, email, password } = validation.data;

        // Verificar si el usuario ya existe
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return NextResponse.json(
                { error: "El correo electrónico ya está registrado" },
                { status: 409 }
            );
        }

        // Hash de la contraseña e inserción con rol CLIENTE
        const hashedPassword = await hashPassword(password);
        const [newUser] = await db
            .insert(users)
            .values({
                name,
                email,
                password: hashedPassword,
                rol: "CLIENTE",
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                rol: users.rol
            });

        // Generar token de verificación
        const verificationToken = await generateVerificationToken(newUser.email);

        // Enviar correo de verificación
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return NextResponse.json(
            {
                message: "Usuario registrado con éxito. Te hemos enviado un enlace de confirmación a tu correo.",
                user: newUser,
                token: verificationToken.token,
                expiresIn: verificationToken.expires,
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Error interno del servidor al registrar" },
            { status: 500 }
        );
    }
}