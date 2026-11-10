//src/app/(dashboard)/[storeId]/(routes)/categories/components/client.tsx

"use client";

import { useState } from "react";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { categories } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { CategoryColumns, Columns } from "../[categoryid]/components/columns";
import { ApiList } from "@/components/api-list";
import { toast } from "sonner";
import axios from "axios"


export type Category = InferSelectModel<typeof categories>;

interface CategoriesClientProps {
    data: CategoryColumns[];
}


const CategoriesClient = ({ data: initialData }: CategoriesClientProps) => {
    const router = useRouter();

    const [data, setData] = useState<CategoryColumns[]>(initialData);
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

            await axios.put(`/api/v1/admin/landing/categories`, payload);
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
                    Title={`Categorias (${data.length})`}
                    Description="Administrar categorias"
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
                        onClick={() => router.push(`/categories/new`)}
                        variant={"default"}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Categoria
                    </Button>
                </div>
            </div>
            <Separator className="my-4 w-full" />
            <DataTable columns={columns} data={data} searchKey="name" />
            <Heading
                Title="API Categorias"
                Description="Copiar la URL para usar la API"
            />
            <Separator />
            <ApiList entityName="categories" entityIdName={"categoryid"} />
        </div>

    )
}

export default CategoriesClient