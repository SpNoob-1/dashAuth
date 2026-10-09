// app/api/v1/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json(
        { message: "Sesión cerrada correctamente" },
        { status: 200 }
    );

    // Expira la cookie inmediatamente
    response.cookies.set("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0), // Fecha en el pasado para eliminarla del navegador
    });

    return response;
}