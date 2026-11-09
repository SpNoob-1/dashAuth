import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { categories } from "@/db/schema";
import { categorySchema } from "@/schemas"; // O usa tu esquema parcial si lo creaste
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PATCH(
    req: Request,
    props: { params: Promise<{ categoryid: string }> }
) {
    try {
        const body = await req.json();
        const validation = categorySchema.safeParse(body);
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

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

        const { categoryid } = await props.params;

        if (!categoryid) {
            return NextResponse.json({ error: "Category ID es requerido" }, { status: 400 });
        }

        const [updatedCategory] = await db
            .update(categories)
            .set({
                name: validation.data.name,
                billboardId: validation.data.billboardId,
                updatedAt: new Date(),
            })
            .where(eq(categories.id, categoryid))
            .returning();

        if (!updatedCategory) {
            return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
        }

        revalidatePath(`/categories`);

        return NextResponse.json(
            { success: "Categoría actualizada correctamente." },
            { status: 200 }
        );

    } catch (error) {
        console.error("[CATEGORY_PATCH_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}