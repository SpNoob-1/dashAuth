import { NextResponse } from "next/server";
import { eq } from "drizzle-orm"; // <-- Asegúrate de importar 'eq'
import { db } from "@/index";
import { products, images } from "@/db/schema";
import { productSchemaUpdate } from "@/schemas";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
    req: Request,
    props: { params: Promise<{ productid: string }> }
) {
    try {
        const body = await req.json();
        const validation = productSchemaUpdate.safeParse(body);
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

        const { name, price, categoryId, sizeId, images: productImages } = validation.data;



        // 1. Actualización del producto principal (¡AGREGADO EL WHERE AQUÍ!)
        await db
            .update(products)
            .set({
                name,
                price: price?.toString(),
                categoryId,
                sizeId,
                updatedAt: new Date(),
            })
            .where(eq(products.id, productid));

        // 2. Elimina las imágenes antiguas asociadas
        await db.delete(images).where(eq(images.productId, productid));

        // 3. Inserta la nueva lista de imágenes 
        if (productImages && productImages.length > 0) {
            await db.insert(images).values(
                productImages.map((img) => ({
                    productId: productid,
                    url: img.url,
                }))
            );
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