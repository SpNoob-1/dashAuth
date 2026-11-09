//src/app/(dashboard)/[storeId]/(routes)/categories/page.tsx

import { db } from "@/index";
import { categories, billboards } from "@/db/schema";
import CategoriesClient from "./components/main-client";
import { desc, eq } from "drizzle-orm";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CategoriesPage = async () => {

    const categoriesList = await db
        .select({
            category: categories,
            billboard: billboards,
        })
        .from(categories)
        .leftJoin(billboards, eq(categories.billboardId, billboards.id))
        .orderBy(desc(categories.order));

    const formattedCategories = categoriesList.map((item) => ({
        id: item.category.id,
        name: item.category.name,
        billboardLabel: item.billboard?.label || "No billboard",
        createdAt: format(item.category.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: es }),
    }));


    return (
        <div className="flex-col w-full">
            <div className="flex-col-1 items-center justify-between w-full px-6 py-6">
                <CategoriesClient data={formattedCategories} />
            </div>
        </div>
    )
}

export default CategoriesPage;