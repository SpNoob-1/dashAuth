import { NextResponse } from "next/server";
import { db } from "@/index";
import { corsHeaders } from "@/lib/cors";

export async function GET(
) {
    try {

        const billboardsList = await db.query.billboards.findMany({
            orderBy: (billboards, { desc }) => [desc(billboards.createdAt)],
        });

        return NextResponse.json(billboardsList, { headers: corsHeaders });
    } catch (error) {
        console.error("[BILLBOARDS_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
    }
}