import { db } from "@/index";
import { landingSecciones } from "@/db/schema";
import SectionClient from "./components/main-client";
import { asc, desc } from "drizzle-orm";
import { format } from "date-fns";
import { es } from "date-fns/locale"

const BillboardsPage = async () => {

    const sectionList = await db
        .select()
        .from(landingSecciones)
        .orderBy(asc(landingSecciones.order));

    const formattedSections = sectionList.map((item) => ({
        id: item.id,
        key: item.key,
        title: item.title ?? "",
        isActive: item.isActive,
        order: item.order,
        subtitle: item.subtitle ?? "",
        createdAt: format(item.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: es }),
    }));


    return (
        <div className="flex-col w-full">
            <div className="flex-col-1 items-center justify-between w-full px-6 py-6">
                <SectionClient data={formattedSections} />
            </div>
        </div>
    )
}

export default BillboardsPage;