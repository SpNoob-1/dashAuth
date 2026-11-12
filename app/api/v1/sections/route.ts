import { NextResponse } from "next/server";
import { db } from "@/index";
import { landingSecciones } from "@/db/schema";
import { corsHeaders } from "@/lib/cors";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const isActiveParam = searchParams.get("isActive");

        // Evaluamos si pasaron el parámetro de forma limpia
        const sectionsList = await db.query.landingSecciones.findMany({
            where: isActiveParam ? eq(landingSecciones.isActive, true) : undefined,
            orderBy: (landingSecciones, { asc }) => [asc(landingSecciones.order)],
        });

        return NextResponse.json(sectionsList, { headers: corsHeaders });

    } catch (error) {
        console.error("[LANDING_SECTIONS_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
    }
}