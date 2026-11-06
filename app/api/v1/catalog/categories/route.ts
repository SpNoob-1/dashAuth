// api/v1/catalog/categories
import { NextResponse } from "next/server";
import { db } from "@/index";
import { categories } from "@/db/schema";
import { corsHeaders } from "@/lib/cors";

export async function GET() {
    try {
        const categoriesList = await db.query.categories.findMany({
            with: {
                billboard: true, // Esto hace el JOIN automático para traerte los datos del billboard asociado
            },
            orderBy: (categories, { desc }) => [desc(categories.createdAt)],
        });

        return NextResponse.json(categoriesList, { headers: corsHeaders });
    } catch (error) {
        console.error("[CATEGORIES_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
    }
}