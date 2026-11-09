//src/app/(dashboard)/[storeId]/(routes)/categories/components/client.tsx

"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter, useParams } from "next/navigation";
import { categories } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { CategoryColumns, columns } from "../[categoryid]/components/columns";
import { ApiList } from "@/components/api-list";


export type Category = InferSelectModel<typeof categories>;

interface CategoriesClientProps {
    data: CategoryColumns[];
}


const CategoriesClient = ({ data }: CategoriesClientProps) => {
    const router = useRouter();
    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center justify-between w-full">
                <Heading
                    Title={`Categories (${data.length})`}
                    Description="Administrar categorias"
                />

                <Button
                    onClick={() => router.push(`/categories/new`)}
                    variant={"default"}
                    size={"lg"}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Categoria
                </Button>
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