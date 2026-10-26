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

// Lista de orígenes permitidos (puedes agregar tus puertos de desarrollo o dominios de producción)
const ALLOWED_ORIGINS = ["http://localhost:3001", "http://localhost:3002"];

function addCorsHeaders(response: NextResponse, origin: string) {
    if (ALLOWED_ORIGINS.includes(origin)) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set(
            "Access-Control-Allow-Methods",
            "GET, DELETE, PATCH, POST, PUT, OPTIONS"
        );
        response.headers.set(
            "Access-Control-Allow-Headers",
            "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Client-Origin"
        );
    }
    return response;
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const origin = req.headers.get("origin") || "";

    // 0. MANEJO DE PREFLIGHT (CORS OPTIONS)
    // Si la petición es OPTIONS, respondemos inmediatamente permitiéndola
    if (req.method === "OPTIONS") {
        const preflightResponse = new NextResponse(null, { status: 204 });
        return addCorsHeaders(preflightResponse, origin);
    }

    // Crear la respuesta base para continuar con el flujo normal
    let res = NextResponse.next();
    res = addCorsHeaders(res, origin);

    // 1. Permitir siempre endpoints API de autenticación (/api/v1/auth/*)
    if (pathname.startsWith(API_AUTH_PREFIX)) {
        const authResponse = NextResponse.next();
        return addCorsHeaders(authResponse, origin);
    }
    // 2. VERIFICAR SI ES UNA RUTA PÚBLICA
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
            if (pathname.startsWith("/api/")) {
                return addCorsHeaders(
                    NextResponse.json({ error: "No autorizado" }, { status: 401 }),
                    origin
                );
            }
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
        if (payload.rol !== "ADMIN") {
            if (pathname.startsWith("/api/")) {
                return addCorsHeaders(
                    NextResponse.json(
                        { error: "Acceso denegado: Se requiere rol ADMIN" },
                        { status: 403 }
                    ),
                    origin
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
                return addCorsHeaders(
                    NextResponse.json(
                        { error: "No autorizado: Inicia sesión para continuar" },
                        { status: 401 }
                    ),
                    origin
                );
            }
            return NextResponse.redirect(new URL("/auth/login", req.url));
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
        return res;
    }

    return res;
}

// 2. CONFIGURACIÓN DEL MATCHER
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};