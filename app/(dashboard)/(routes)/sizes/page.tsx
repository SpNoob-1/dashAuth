import { db } from "@/index";
import { sizes } from "@/db/schema";
import SizesClient from "./components/main-client";
import { desc, eq } from "drizzle-orm";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const BillboardsPage = async () => {

    const sizesList = await db
        .select()
        .from(sizes)
        .orderBy(desc(sizes.createdAt));

    const formattedSizes = sizesList.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: es }),
    }));


    return (
        <div className="flex-col w-full">
            <div className="flex-col-1 items-center justify-between w-full px-6 py-6">
                <SizesClient data={formattedSizes} />
            </div>
        </div>
    )
}

export default BillboardsPage;