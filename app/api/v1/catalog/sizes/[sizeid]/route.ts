import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/index";
import { sizes } from "@/db/schema";
import { corsHeaders } from "@/lib/cors";

export async function GET(
    req: Request,
    props: { params: Promise<{ sizeid: string }> }
) {
    try {

        const { sizeid } = await props.params;

        if (!sizeid) {
            return new NextResponse("Size ID es requerido", { status: 400 });
        }

        const size = await db.query.sizes.findFirst({
            where: and(
                eq(sizes.id, sizeid),
            ),
        });

        return NextResponse.json(size, { headers: corsHeaders });
    } catch (error) {
        console.error("[SIZE_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}