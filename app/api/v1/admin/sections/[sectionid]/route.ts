import { NextResponse } from "next/server";
import { eq } from "drizzle-orm"; // Quitamos 'and' ya que solo es una condición
import { db } from "@/index";
import { landingSecciones } from "@/db/schema";
import { sectionSchema } from "@/schemas";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PATCH(
    req: Request,
    props: { params: Promise<{ sectionid: string }> }
) {
    try {
        const body = await req.json();
        const validation = sectionSchema.safeParse(body);
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

        const { sectionid } = await props.params;

        if (!sectionid) {
            return NextResponse.json({ error: "Section ID es requerido" }, { status: 400 });
        }

        const [updatedSection] = await db
            .update(landingSecciones)
            .set({
                key: validation.data.key,
                title: validation.data.title,
                subtitle: validation.data.subtitle,
                updatedAt: new Date(),
            })
            .where(eq(landingSecciones.id, sectionid))
            .returning();

        if (!updatedSection) {
            return NextResponse.json({ error: "Section no encontrado" }, { status: 404 });
        }

        revalidatePath(`/sections`);

        return NextResponse.json(
            { success: "Section actualizada correctamente." },
            { status: 200 }
        );

    } catch (error) {
        console.error("[SECTION_PATCH_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}