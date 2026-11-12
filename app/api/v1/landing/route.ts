// app/api/v1/landing

import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/index";
import { products, categories, landingSecciones } from "@/db/schema";
import { corsHeaders } from "@/lib/cors";

export async function GET(
    req: Request
) {
    try {
        const { searchParams } = new URL(req.url);

        const categoryId = searchParams.get("categoryid") || undefined;
        const sizeId = searchParams.get("sizeid") || undefined;
        const isFeatured = searchParams.get("isFeatured");


        const productList = await db.query.products.findMany({
            where: and(
                categoryId ? eq(products.categoryId, categoryId) : undefined,
                sizeId ? eq(products.sizeId, sizeId) : undefined,
                eq(products.isFeatured, true),
                eq(products.isArchived, false) // Excluir productos archivados de la tienda pública
            ),
            with: {
                images: true,
                category: true,
                size: true,
            },
            orderBy: (products, { desc }) => [desc(products.order)],
        });

        const categoryList = await db.query.categories.findMany({
            where: eq(categories.isFeatured, true),
            with: {
                billboard: true,
            },
            orderBy: (categories, { asc }) => [asc(categories.order)]
        })

        const sectionsList = await db.query.landingSecciones.findMany({
            where: eq(landingSecciones.isActive, true),
            orderBy: (landingSecciones, { asc }) => [asc(landingSecciones.order)],
        });


        return NextResponse.json(
            {
                success: true,
                data: {
                    sections: sectionsList,
                    categories: categoryList,
                    products: productList,
                },
            },
            { headers: corsHeaders }
        );
    } catch (error) {
        console.error("[PRODUCTS_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
    }
}