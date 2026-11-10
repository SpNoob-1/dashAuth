// api/v1/admin/landing/products/

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { landingSecciones } from "@/db/schema";
import { sectionSchemaIsactive } from "@/schemas";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
    req: Request,
    props: { params: Promise<{ sectionid: string }> }
) {
    try {
        const body = await req.json();
        const validation = sectionSchemaIsactive.safeParse(body);
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // 3. Validamos si su rol es ADMIN
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

        const valuesToUpdate: {
            isActive?: boolean;
        } = {};

        if (validation.data.isActive !== undefined) {
            valuesToUpdate.isActive = validation.data.isActive;
        }

        if (Object.keys(valuesToUpdate).length > 0) {
            await db
                .update(landingSecciones)
                .set(valuesToUpdate)
                .where(eq(landingSecciones.id, sectionid));
        }

        return NextResponse.json(
            { success: "Section actualizada correctamente." },
            { status: 200 }
        );

    } catch (error) {
        console.error("[SECTION_PATCH_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}