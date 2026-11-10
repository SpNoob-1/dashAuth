import { NextResponse } from "next/server";
import { db } from "@/index";
import { landingSecciones } from "@/db/schema";
import { sectionSchema } from "@/schemas";
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = sectionSchema.safeParse(body);
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

        const [newSection] = await db
            .insert(landingSecciones)
            .values({
                key: validation.data.key,
                title: validation.data.title,
                subtitle: validation.data.subtitle
            })
            .returning();

        revalidatePath(`/sections`);

        return NextResponse.json(
            { success: "Section creado correctamente.", data: newSection },
            { status: 201 }
        );

    } catch (error) {
        console.error("[Section_POST_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}