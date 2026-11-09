import { db } from "@/index";
import { categories, billboards as billboardsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import CategoryForm from "./components/category-form";

interface CategoryPageProps {
    params: Promise<{
        categoryid: string;
    }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
    const { categoryid } = await params;

    // 1. Consulta la categoría solo si no es la ruta de creación
    const categoryPromise =
        categoryid !== "new"
            ? db
                .select()
                .from(categories)
                .where(eq(categories.id, categoryid))
                .then((res) => res[0] || null)
            : Promise.resolve(null);

    // 2. Consulta SIEMPRE los billboards de la tienda para llenar el desplegable del formulario
    const billboardsPromise = db
        .select()
        .from(billboardsTable)

    // Ejecuta ambas consultas en paralelo en la base de datos
    const [category, billboards] = await Promise.all([
        categoryPromise,
        billboardsPromise,
    ]);

    return (
        <div className="flex-col w-full">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm initialData={category} billboards={billboards} />
            </div>
        </div>
    );
};

export default CategoryPage;