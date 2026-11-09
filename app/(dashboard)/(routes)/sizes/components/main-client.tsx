"use client";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { sizes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { SizeColumns, columns } from "../[sizeid]/components/columns"
import { ApiList } from "@/components/api-list";


export type Sizes = InferSelectModel<typeof sizes>;

interface SizesClientProps {
    data: SizeColumns[];
}


const SizesClient = ({ data }: SizesClientProps) => {
    const router = useRouter();

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center justify-between w-full">
                <Heading
                    Title={`Sizes (${data.length})`}
                    Description="Manage your store's sizes"
                />

                <Button
                    onClick={() => router.push(`/sizes/new`)}
                    variant={"default"}
                    size={"lg"}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar un tamano
                </Button>
            </div>
            <Separator className="my-4 w-full" />
            <DataTable columns={columns} data={data} searchKey="name" />
            <Heading
                Title="API Sizes"
                Description="Copiar la url para usar API"
            />
            <Separator />
            <ApiList entityName="sizes" entityIdName={"sizeid"} />
        </div>

    )
}

export default SizesClient