// app/api/v1/auth/register/route.ts
import { NextResponse } from "next/server";
import { RegisterSchema } from "@/schemas";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = RegisterSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Datos de formulario inválidos",
                    details: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { name, email, password } = validation.data;

        // 2. Respuesta temporal de prueba para confirmar recepción
        return NextResponse.json(
            {
                message: "Datos recibidos y validados correctamente",
                data: { name, email, passwordLength: password.length },
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