// app/api/v1/auth/login/route.ts
import { NextResponse } from "next/server";
import { comparePassword, signToken } from "@/lib/auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/users";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = LoginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Credenciales inválidas" },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;

        // Buscar usuario en base de datos
        const user = await getUserByEmail(email)

        if (!user) {
            return NextResponse.json(
                { error: "Credenciales incorrectas" },
                { status: 401 }
            );
        }

        // Validar contraseña
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Credenciales incorrectas" },
                { status: 401 }
            );
        }

        if (!user.rol) {
            return NextResponse.json(
                { error: "El usuario no tiene un rol válido asignado" },
                { status: 400 }
            );
        }

        // Emitir Token JWT Bearer
        const token = await signToken({
            sub: user.id.toString(),
            email: user.email,
            rol: user.rol,
        });

        const response = NextResponse.json(
            {
                message: "Inicio de sesión exitoso",
                token, // Retorno como Bearer token
                user: { id: user.id, email: user.email, role: user.rol },
            },
            { status: 200 }
        );

        // Guardar también en cookie HTTP-Only para facilidades del Middleware en servidor
        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 8, // 8 horas
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: "Error interno en la autenticación" },
            { status: 500 }
        );
    }
}