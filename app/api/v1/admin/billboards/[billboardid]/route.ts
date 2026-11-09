import { NextResponse } from "next/server";
import { eq } from "drizzle-orm"; // Quitamos 'and' ya que solo es una condición
import { db } from "@/index";
import { billboards } from "@/db/schema";
import { billboardSchema } from "@/schemas";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PATCH(
    req: Request,
    props: { params: Promise<{ billboardid: string }> }
) {
    try {
        const body = await req.json();
        const validation = billboardSchema.safeParse(body);
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

        const { billboardid } = await props.params;

        if (!billboardid) {
            return NextResponse.json({ error: "Billboard ID es requerido" }, { status: 400 });
        }

        const [updatedBillboard] = await db
            .update(billboards)
            .set({
                label: validation.data.label,
                imageUrl: validation.data.imageUrl,
                updatedAt: new Date(),
            })
            .where(eq(billboards.id, billboardid)) // Simplificado sin 'and()'
            .returning();

        if (!updatedBillboard) {
            return NextResponse.json({ error: "Billboard no encontrado" }, { status: 404 }); // Corregido el typo
        }

        revalidatePath(`/billboards`); // Corregido para apuntar a la ruta correcta de carteles

        return NextResponse.json(
            { success: "Billboard actualizado correctamente." },
            { status: 200 }
        );

    } catch (error) {
        console.error("[BILLBOARD_PATCH_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}