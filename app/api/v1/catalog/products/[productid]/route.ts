// app/api/v1/catalog/products/[productid]/route.ts

import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/index";
import { products } from "@/db/schema";
import { corsHeaders } from "@/lib/cors";

export async function GET(
    req: Request,
    props: { params: Promise<{ productid: string }> }
) {
    try {

        const { productid } = await props.params;

        if (!productid) {
            return new NextResponse("Product ID es requerido", { status: 400 });
        }

        const category = await db.query.products.findFirst({
            where: and(
                eq(products.id, productid),
            ),
            with: {
                category: true,
                images: true,
                size: true
            },
        });

        return NextResponse.json(category, { headers: corsHeaders });
    } catch (error) {
        console.error("[CATEGORY_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}