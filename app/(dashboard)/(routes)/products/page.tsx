import { db } from "@/index";
import { products, categories, sizes } from "@/db/schema";
import ProductClient from "./components/main-client";
import { desc, eq } from "drizzle-orm";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";

const ProductsPage = async () => {

    const productsList = await db
        .select()
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(sizes, eq(products.sizeId, sizes.id))
        .orderBy(desc(products.order));

    const formattedProducts = productsList.map((item) => ({
        id: item.products.id,
        name: item.products.name,
        price: formatCurrency(Number(item.products.price)),
        isArchived: item.products.isArchived,
        isFeatured: item.products.isFeatured,
        category: item.categories?.name || "",
        order: item.products.order,
        size: item.sizes?.name || "",
        createdAt: format(item.products.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: es }),
    }));


    return (
        <div className="flex-col w-full">
            <div className="flex-col-1 items-center justify-between w-full px-6 py-6">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    )
}


export default ProductsPage;
