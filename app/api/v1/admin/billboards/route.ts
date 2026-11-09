import { NextResponse } from "next/server";
import { db } from "@/index";
import { billboards } from "@/db/schema";
import { billboardSchema } from "@/schemas";
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = billboardSchema.safeParse(body);
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // Validamos si su rol es ADMIN
        if (user.rol !== "ADMIN") {
            return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
        }

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Datos de registro inválidos",
                    details: validation.error.flatten((issue) => issue.message).fieldErrors,
                },
                { status: 400 }
            );
        }

        const [newBillboard] = await db
            .insert(billboards)
            .values({
                label: validation.data.label,
                imageUrl: validation.data.imageUrl,
            })
            .returning();

        revalidatePath(`/billboards`);

        return NextResponse.json(
            { success: "Billboard creado correctamente.", data: newBillboard },
            { status: 201 }
        );

    } catch (error) {
        console.error("[BILLBOARD_POST_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}