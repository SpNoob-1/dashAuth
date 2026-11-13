import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { products } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { productSchemaReorden } from "@/schemas";
import { revalidatePath } from "next/cache";


export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const validation = productSchemaReorden.safeParse(body);
        const user = await getCurrentUser();

        // 2. Validación de Autenticación
        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // 3. Validación de Roles
        if (user.rol !== "ADMIN") {
            return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
        }

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Datos inválidos para reordenar",
                    details: validation.error.flatten((issue) => issue.message).fieldErrors,
                },
                { status: 400 }
            );
        }

        const { items } = validation.data;

        // 4. SOPORTE TRANSACCIONAL SQL
        await db.transaction(async (tx) => {
            for (const item of items) {
                await tx
                    .update(products)
                    .set({ order: item.order })
                    .where(eq(products.id, item.id));
            }
        });


        revalidatePath("/products")

        return NextResponse.json(
            { success: "Productos reordenados correctamente." },
            { status: 200 }
        );

    } catch (error) {
        console.error("[PRODUCTS_REORDER_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}