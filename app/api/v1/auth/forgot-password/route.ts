import { sendResetPasswordEmail } from "@/lib/mail";
import { NextResponse } from "next/server";
import { generatePasswordResetToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/users";
import { forgotPasswordSchema } from "@/schemas";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = forgotPasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Datos de registro inválidos" },
                { status: 400 }
            );
        }
        const { email } = validation.data;
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            // No revelamos si el email existe.
            return NextResponse.json(
                { message: "Si el correo está registrado recibirás instrucciones" },
                { status: 200 }
            );
        }

        const passwordResetToken = await generatePasswordResetToken(email);

        await sendResetPasswordEmail(
            passwordResetToken.email,
            passwordResetToken.token
        )


        return NextResponse.json(
            { message: "Correo enviado exitosamentes. Revisa tu bandeja de entrada" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al restablecer contraseña:", error);
        return NextResponse.json(
            { error: "Error interno del servidor al restablecer la contraseña" },
            { status: 500 }
        );
    }
}


