import { NextResponse } from "next/server";
import { db } from "@/index";
import { products, images } from "@/db/schema";
import { productSchema } from "@/schemas";
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = productSchema.safeParse(body);
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

        const { name, price, categoryId, description, sizeId, images: productImages } = validation.data;

        // 1. Inserción del producto principal
        const [newProduct] = await db
            .insert(products)
            .values({
                name,
                price: price.toString(),
                description,
                categoryId,
                sizeId,
            })
            .returning();

        // 2. Inserción de las imágenes asociadas al producto creado
        if (productImages && productImages.length > 0) {
            await db.insert(images).values(
                productImages.map((img) => ({
                    productId: newProduct.id,
                    url: img.url,
                }))
            );
        }

        revalidatePath(`/products`);

        return NextResponse.json(
            { success: "Producto creado correctamente.", data: newProduct },
            { status: 201 }
        );

    } catch (error) {
        console.error("[PRODUCTS_POST_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}