import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/index";
import { corsHeaders } from "@/lib/cors";
import { billboards } from "@/db/schema"


export async function GET(
    req: Request,
    props: { params: Promise<{ billboardid: string }> }
) {
    try {
        const { billboardid } = await props.params;

        if (!billboardid) {
            return new NextResponse("Billboard ID es requerido", { status: 400, headers: corsHeaders });
        }

        const billboard = await db.query.billboards.findFirst({
            where: and(
                eq(billboards.id, billboardid),
            ),
        });

        if (!billboard) {
            return new NextResponse("Billboard no encontrado", { status: 404, headers: corsHeaders });
        }

        return NextResponse.json(billboard, { headers: corsHeaders });
    } catch (error) {
        console.error("[BILLBOARD_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
    }
}