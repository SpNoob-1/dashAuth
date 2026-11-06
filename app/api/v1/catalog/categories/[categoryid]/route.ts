import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/index";
import { categories } from "@/db/schema";

export async function GET(
    req: Request,
    props: { params: Promise<{ categoryid: string }> }
) {
    try {

        const { categoryid } = await props.params;

        if (!categoryid) {
            return new NextResponse("Category ID es requerido", { status: 400 });
        }

        const category = await db.query.categories.findFirst({
            where: and(
                eq(categories.id, categoryid),
            ),
            with: {
                billboard: true,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("[CATEGORY_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}