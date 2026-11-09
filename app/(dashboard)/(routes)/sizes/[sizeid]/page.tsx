import { db } from "@/index";
import { sizes } from "@/db/schema";
import { eq } from "drizzle-orm";
import SizeForm from "./components/size-form";

interface SizePageProps {
    params: {
        sizeid: string;
    };
}

const SizePage = async ({ params }: SizePageProps) => {

    const { sizeid } = await params;

    let size = null;

    // Solo consultamos la base de datos si NO es la palabra "new"
    if (sizeid !== "new") {
        const result = await db
            .select()
            .from(sizes)
            .where(eq(sizes.id, sizeid));

        size = result[0] || null;
    }

    return (
        <div className="flex-col w-full">
            <div className="flex-col-1 items-center justify-between px-6 py-6">
                <SizeForm initialData={size} />
            </div>
        </div>
    )
}

export default SizePage;   