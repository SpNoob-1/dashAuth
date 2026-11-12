import { NextResponse } from "next/server";
import { db } from "@/index";
import { categories } from "@/db/schema";
import { categorySchema } from "@/schemas";
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = categorySchema.safeParse(body);
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

        const [newCategory] = await db
            .insert(categories)
            .values({
                name: validation.data.name,
                billboardId: validation.data.billboardId,
            })
            .returning();

        revalidatePath(`/categories`);

        return NextResponse.json(
            { success: "Categoría creada correctamente.", data: newCategory },
            { status: 201 }
        );

    } catch (error) {
        console.error("[CATEGORY_POST_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}