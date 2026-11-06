
import { db } from "@/index";
import { categories, sizes, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProductForm from "./components/product-form";

interface ProductPageProps {
    params: Promise<{
        productid: string;
    }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
    const { productid } = await params;

    // 1. Consulta el producto e imágenes solo si no es la ruta "new"
    const productPromise =
        productid !== "new"
            ? db.query.products.findFirst({
                where: eq(products.id, productid),
                with: {
                    images: true, // Incluye el arreglo de imágenes asociadas
                },
            })
            : Promise.resolve(null);

    // 2. Consultas en paralelo para llenar los desplegables del formulario
    const categoriesPromise = db
        .select()
        .from(categories)

    const sizesPromise = db
        .select()
        .from(sizes)

    // Ejecuta todas las consultas simultáneamente en la base de datos
    const [product, categoriesList, sizesList] = await Promise.all([
        productPromise,
        categoriesPromise,
        sizesPromise,
    ]);

    return (
        <div className="flex-col w-full">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm
                    initialData={product ?? null}
                    categories={categoriesList}
                    sizes={sizesList}
                />
            </div>
        </div>
    );
};

export default ProductPage;