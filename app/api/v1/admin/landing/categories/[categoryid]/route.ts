// api/v1/admin/landing/products/

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { categories } from "@/db/schema";
import { categorySchemaIsLanding } from "@/schemas";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
    req: Request,
    props: { params: Promise<{ categoryid: string }> }
) {
    try {
        const body = await req.json();
        const validation = categorySchemaIsLanding.safeParse(body);
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

        const { categoryid } = await props.params;

        if (!categoryid) {
            return NextResponse.json({ error: "Categpry ID es requerido" }, { status: 400 });
        }

        const valuesToUpdate: {
            isFeatured?: boolean;
        } = {};

        if (validation.data.isFeatured !== undefined) {
            valuesToUpdate.isFeatured = validation.data.isFeatured;
        }

        if (Object.keys(valuesToUpdate).length > 0) {
            await db
                .update(categories)
                .set(valuesToUpdate)
                .where(eq(categories.id, categoryid));
        }

        return NextResponse.json(
            { success: "Category actualizado correctamente." },
            { status: 200 }
        );

    } catch (error) {
        console.error("[CATEGORY_PATCH_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}