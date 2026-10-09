// routes.ts


/**
 * Rutas que no requieren ninguna autenticación.
 * Accesibles tanto para visitantes como para usuarios logueados.
 */
export const PUBLIC_ROUTES: string[] = [
    "/",           // Home
    "/about",      // Acerca de
    "/contacto",   // Formulario de contacto
    "/tienda",     // Catálogo de productos
    "/terminos",   // Términos y condiciones
];

// Rutas que requieren estar autenticado (cualquier rol: CLIENTE o ADMIN)
// Mueves tus arreglos directamente aquí:
export const PROTECTED_ROUTES = [
    "/dashboard",
    "/profile",
    "/orders",
    "/configuracion",
];

// Rutas exclusivas para administradores
export const ADMIN_ROUTES = [
    "/admin",
    "/api/v1/admin",
];

// Rutas solo para usuarios NO autenticados (invitados)
export const AUTH_ROUTES = [
    "/login",
    "/register",
];

// Rutas API que requieren autenticación
export const PROTECTED_API_ROUTES = [
    "/api/v1/user",
    "/api/v1/checkout",
];

export const API_AUTH_PREFIX = "/api/v1/auth";