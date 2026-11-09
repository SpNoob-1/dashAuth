import { db } from "@/index";
import { billboards } from "@/db/schema";
import BillboardClient from "./components/main-client";
import { desc, eq } from "drizzle-orm";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const BillboardsPage = async () => {


    const billboardsList = await db
        .select()
        .from(billboards)
        .orderBy(desc(billboards.createdAt));

    const formattedBillboards = billboardsList.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: es }),
    }));


    return (
        <div className="flex-col w-full">
            <div className="flex-col-1 items-center justify-between w-full px-6 py-6">
                <BillboardClient data={formattedBillboards} />
            </div>
        </div>
    )
}

export default BillboardsPage;