// app/api/v1/auth/login/route.ts
import { NextResponse } from "next/server";
import { comparePassword, signToken } from "@/lib/auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/users";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserById } from "@/data/users";

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
        // const userById = await getUserById(user.id)

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


        // if (!user.emailVerified) {
        //     // Generas un nuevo token para que el usuario pueda recibir un enlace fresco si el anterior venció
        //     const verificationToken = await generateVerificationToken(user.email);

        //     // (Aquí enviaremos el correo con Resend más adelante)

        //     return NextResponse.json(
        //         { error: "Tu cuenta aún no ha sido verificada. Te hemos enviado un nuevo correo de confirmación." },
        //         { status: 403 }
        //     );
        // }

        // Emitir Token JWT Bearer
        const token = await signToken({
            sub: user.id.toString(),
            email: user.email,
            rol: user.rol,
            name: user.name,
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