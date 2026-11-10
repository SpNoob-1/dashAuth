import { db } from "@/index";
import { landingSecciones } from "@/db/schema";
import { eq } from "drizzle-orm";
import SizeForm from "./components/section-form";

interface SizePageProps {
    params: {
        sectionid: string;
    };
}

const SizePage = async ({ params }: SizePageProps) => {

    const { sectionid } = await params;

    let section = null;

    // Solo consultamos la base de datos si NO es la palabra "new"
    if (sectionid !== "new") {
        const result = await db
            .select()
            .from(landingSecciones)
            .where(eq(landingSecciones.id, sectionid));

        section = result[0] || null;
    }

    return (
        <div className="flex-col w-full">
            <div className="flex-col-1 items-center justify-between px-6 py-6">
                <SizeForm initialData={section} />
            </div>
        </div>
    )
}

export default SizePage;   