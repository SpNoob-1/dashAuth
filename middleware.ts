import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import {
    PUBLIC_ROUTES,
    PROTECTED_ROUTES,
    ADMIN_ROUTES,
    AUTH_ROUTES,
    PROTECTED_API_ROUTES,
    API_AUTH_PREFIX,
} from "@/routes";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 0. Permitir siempre endpoints API de autenticación (/api/v1/auth/*)
    if (pathname.startsWith(API_AUTH_PREFIX)) {
        return NextResponse.next();
    }

    // 1. VERIFICAR SI ES UNA RUTA PÚBLICA
    // Soporta rutas dinámicas automáticamente (ej. /tienda/producto-123)
    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Extraer token de Cookies o Header Authorization
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
        const redirectUrl = payload.rol === "ADMIN" ? "/admin" : "/configuracion";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // D. PERMITIR ACCESO A RUTAS PÚBLICAS O CUALQUIER OTRA RUTA NO CONTROLADA
    if (isPublicRoute) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

// 2. CONFIGURACIÓN DEL MATCHER
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|images|api/v1/auth).*)",
    ],
};