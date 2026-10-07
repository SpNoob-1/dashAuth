// app/api/v1/auth/login/route.ts
import { NextResponse } from "next/server";
import { LoginSchema } from "@/schemas";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = LoginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Datos de formulario inválidos",
                    details: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;

        // 2. Respuesta temporal de prueba para confirmar recepción
        return NextResponse.json(
            {
                message: "Datos recibidos y validados correctamente",
                data: { email, passwordLength: password.length },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Error al procesar la solicitud" },
            { status: 500 }
        );
    }
}