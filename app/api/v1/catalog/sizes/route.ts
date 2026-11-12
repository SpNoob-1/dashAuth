// api/v1/catalog/categories
import { NextResponse } from "next/server";
import { db } from "@/index";
import { sizes } from "@/db/schema";
import { corsHeaders } from "@/lib/cors";

export async function GET() {
    try {
        const categoriesList = await db.query.sizes.findMany({
            orderBy: (categories, { desc }) => [desc(categories.createdAt)],
        });

        return NextResponse.json(categoriesList, { headers: corsHeaders });
    } catch (error) {
        console.error("[SIZE_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
    }
}