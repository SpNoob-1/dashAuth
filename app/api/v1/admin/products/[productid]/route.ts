// api/v1/admin/landing/products/

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { products } from "@/db/schema";
import { productSchemaIsLanding } from "@/schemas";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
    req: Request,
    props: { params: Promise<{ productid: string }> }
) {
    try {
        const body = await req.json();
        const validation = productSchemaIsLanding.safeParse(body);
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

        const { productid } = await props.params;

        if (!productid) {
            return NextResponse.json({ error: "Product ID es requerido" }, { status: 400 });
        }

        const valuesToUpdate: {
            isFeatured?: boolean;
            isArchived?: boolean;
        } = {};

        if (validation.data.isFeatured !== undefined) {
            valuesToUpdate.isFeatured = validation.data.isFeatured;
        }

        if (validation.data.isArchived !== undefined) {
            valuesToUpdate.isArchived = validation.data.isArchived;
        }

        if (Object.keys(valuesToUpdate).length > 0) {
            await db
                .update(products)
                .set(valuesToUpdate)
                .where(eq(products.id, productid));
        }

        return NextResponse.json(
            { success: "Producto actualizado correctamente." },
            { status: 200 }
        );

    } catch (error) {
        console.error("[PRODUCT_PATCH_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}