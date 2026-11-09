import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { sizes } from "@/db/schema";
import { sizeSchema } from "@/schemas";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PATCH(
    req: Request,
    props: { params: Promise<{ sizeid: string }> }
) {
    try {
        const body = await req.json();
        const validation = sizeSchema.safeParse(body);
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

        const { sizeid } = await props.params;

        if (!sizeid) {
            return NextResponse.json({ error: "Talla ID es requerida" }, { status: 400 });
        }

        const [updatedSize] = await db
            .update(sizes)
            .set({
                name: validation.data.name,
                value: validation.data.value,
                updatedAt: new Date(),
            })
            .where(eq(sizes.id, sizeid))
            .returning();

        if (!updatedSize) {
            return NextResponse.json({ error: "Talla no encontrada" }, { status: 404 });
        }

        revalidatePath(`/sizes`);

        return NextResponse.json(
            { success: "Talla actualizada correctamente." },
            { status: 200 }
        );

    } catch (error) {
        console.error("[SIZE_PATCH_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}