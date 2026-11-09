import { NextResponse } from "next/server";
import { db } from "@/index";
import { sizes } from "@/db/schema";
import { sizeSchema } from "@/schemas";
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = sizeSchema.safeParse(body);
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // Validamos si su rol es ADMIN
        if (user.rol !== "ADMIN") {
            return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
        }

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Datos de registro inválidos",
                    details: validation.error.flatten((issue) => issue.message).fieldErrors,
                },
                { status: 400 }
            );
        }

        const [newSize] = await db
            .insert(sizes)
            .values({
                name: validation.data.name,
                value: validation.data.value,
            })
            .returning();

        revalidatePath(`/sizes`);

        return NextResponse.json(
            { success: "Talla creada correctamente.", data: newSize },
            { status: 201 }
        );

    } catch (error) {
        console.error("[SIZE_POST_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}