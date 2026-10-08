import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

// 1. DEFINICIÓN DE RUTAS Y PERMISOS
// Rutas que requieren estar autenticado (cualquier rol: CLIENTE o ADMIN)
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/orders", "/configuracion"];

// Rutas exclusivas para administradores
const ADMIN_ROUTES = ["/admin", "/api/v1/admin",];

// Rutas solo para usuarios NO autenticados (invitados)
const AUTH_ROUTES = ["/login", "/register"];

// Rutas API que requieren autenticación
const PROTECTED_API_ROUTES = ["/api/v1/user", "/api/v1/checkout",];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Extraer token de Cookie o Header Authorization
    const cookieToken = req.cookies.get("auth_token")?.value;
    const authHeader = req.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    const token = cookieToken || bearerToken;
    const payload = token ? await verifyToken(token) : null;

    // A. PROTEGER RUTAS DE ADMINISTRADOR (Rol: ADMIN)
    const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
    if (isAdminRoute) {
        if (!payload) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (payload.rol !== "ADMIN") {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json(
                    { error: "Acceso denegado: Se requiere rol ADMIN" },
                    { status: 403 }
                );
            }
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // B. PROTEGER RUTAS PRIVADAS GENERALES (Rol: CLIENTE o ADMIN)
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isProtectedApi = PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route));

    if (isProtectedRoute || isProtectedApi) {
        if (!payload) {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json(
                    { error: "No autorizado: Inicia sesión para continuar" },
                    { status: 401 }
                );
            }
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // C. RUTAS SOLO PARA INVITADOS (/login, /register)
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
    if (isAuthRoute && payload) {
        // Si ya inició sesión, redirigir según su rol
        const redirectUrl = payload.rol === "ADMIN" ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // D. RUTAS PÚBLICAS (/, /products, /about, etc.)
    // Pasan libremente sin ser interceptadas por las validaciones anteriores.
    return NextResponse.next();
}

// 2. CONFIGURACIÓN DEL MATCHER
export const config = {
    matcher: [
        /*
          Coincide con todas las rutas excepto:
          - /api/auth/* (tus endpoints públicos de login/register)
          - Archivos estáticos (_next/static, _next/image, favicon.ico, etc.)
        */
        "/configuracion",
        "/admin/:path*",
        "/login",
        "/register",
        "/((?!_next/static|_next/image|favicon.ico|images|api/v1/auth).*)",
    ],
};