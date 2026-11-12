import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/index";
import { landingSecciones } from "@/db/schema";
import { corsHeaders } from "@/lib/cors";

export async function GET(
    req: Request,
    props: { params: Promise<{ sectionid: string }> }
) {
    try {

        const { sectionid } = await props.params;

        if (!sectionid) {
            return new NextResponse("Section ID es requerido", { status: 400 });
        }

        const section = await db.query.landingSecciones.findFirst({
            where: and(
                eq(landingSecciones.id, sectionid),
            ),
        });

        return NextResponse.json(section, { headers: corsHeaders });
    } catch (error) {
        console.error("[CATEGORY_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}