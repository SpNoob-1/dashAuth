// app/api/v1/addresses/locations/route.ts
import { NextResponse } from "next/server";
import { db } from "@/index";
import { corsHeaders } from "@/lib/cors";

export async function GET(req: Request) {
    try {
        const locations = await db.query.departamentos.findMany({
            with: {
                municipios: true,
            },
            orderBy: (departamentos, { asc }) => [asc(departamentos.name)],
        });

        return NextResponse.json(locations, { headers: corsHeaders });
    } catch (error) {
        console.error("[LOCATIONS_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500, headers: corsHeaders });
    }
}