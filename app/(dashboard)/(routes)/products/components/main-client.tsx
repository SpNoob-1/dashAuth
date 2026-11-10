"use client";

import { useState } from "react";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { ProductColumns, Columns } from "../[productid]/components/colums";
import { ApiList } from "@/components/api-list";
import axios from "axios";
import { toast } from "sonner";

interface ProductClientProps {
    data: ProductColumns[];
}

const ProductClient = ({ data: initialData }: ProductClientProps) => {
    const router = useRouter();
    const [data, setData] = useState<ProductColumns[]>(initialData);
    const [isLoading, setIsLoading] = useState(false);

    // Función para mover elementos localmente arriba o abajo
    const handleMove = (index: number, direction: "up" | "down") => {
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= data.length) return;

        const updated = [...data];
        const temp = updated[index];
        updated[index] = updated[newIndex];
        updated[newIndex] = temp;

        // Reasignamos el orden secuencialmente
        const reindexed = updated.map((item, idx) => ({
            ...item,
            order: idx + 1,
        }));

        setData(reindexed);
    };

    // Función para hacer el fetch masivo (PUT) al backend
    const handleSaveOrder = async () => {
        setIsLoading(true);
        try {
            const payload = {
                items: data.map((item, idx) => ({
                    id: item.id,
                    order: idx + 1,
                })),
            };

            await axios.put(`/api/v1/admin/landing/products`, payload);
            toast.success("Orden actualizado correctamente.");
            router.refresh();
        } catch (error) {
            console.error("[SAVE_ORDER_ERROR]", error);
            toast.error("Ocurrió un error al guardar el orden.");
        } finally {
            setIsLoading(false);
        }
    };

    // Generamos las columnas pasándoles la función de movimiento y estado de carga
    const columns = Columns(handleMove, isLoading);

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center justify-between w-full">
                <Heading
                    Title={`Productos (${data.length})`}
                    Description="Administra los productos de la tienda y su orden"
                />

                <div className="flex items-center gap-x-2">
                    <Button
                        onClick={handleSaveOrder}
                        variant="outline"
                        disabled={isLoading}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Guardar orden
                    </Button>

                    <Button
                        onClick={() => router.push(`/products/new`)}
                        variant={"default"}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Producto
                    </Button>
                </div>
            </div>
            <Separator className="my-4 w-full" />
            <DataTable columns={columns} data={data} searchKey="name" />
            <Heading
                Title="API Productos"
                Description="Copiar la URL para usar la API"
            />
            <Separator />
            <ApiList entityName="productos" entityIdName={"productID"} />
        </div>
    );
};

export default ProductClient;