// app/api/v1/auth/admin/route.ts
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth'; // O tu función para verificar el token desde cookies

export async function GET() {
    // 1. Obtenemos el usuario autenticado desde la cookie en el backend de la API
    const user = await getCurrentUser();

    // 2. Si no hay usuario o no está logueado
    if (!user) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 3. Validamos si su rol es ADMIN
    if (user.rol !== "ADMIN") {
        return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // 4. Si pasa la validación, devolvemos los datos protegidos
    return NextResponse.json({ message: "Bienvenido al panel de administración" });
}