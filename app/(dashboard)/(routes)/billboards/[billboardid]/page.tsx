import { db } from "@/index";
import { billboards } from "@/db/schema";
import { eq } from "drizzle-orm";
import BillboardForm from "./components/billboard-form";

interface BillboardPageProps {
    params: {
        billboardid: string;
    };
}

const billboardPage = async ({ params }: BillboardPageProps) => {

    const { billboardid } = await params;

    let billboard = null;

    // Solo consultamos la base de datos si NO es la palabra "new"
    if (billboardid !== "new") {
        const result = await db
            .select()
            .from(billboards)
            .where(eq(billboards.id, billboardid));

        billboard = result[0] || null;
    }

    return (
        <div className="flex-col w-full">
            <div className="flex-col-1 items-center justify-between px-6 py-6">
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    )
}

export default billboardPage;   