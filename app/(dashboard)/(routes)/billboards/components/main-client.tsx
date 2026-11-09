"use client";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter, useParams } from "next/navigation";
import { billboards } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { BillboardColumns, columns } from "../[billboardid]/components/columns";
import { ApiList } from "@/components/api-list";
export type Billboard = InferSelectModel<typeof billboards>;

interface BillboardClientProps {
    data: BillboardColumns[];
}


const BillboardClient = ({ data }: BillboardClientProps) => {
    const router = useRouter();
    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center justify-between w-full">
                <Heading
                    Title={`Billboards (${data.length})`}
                    Description="Administrar billboards"
                />

                <Button
                    onClick={() => router.push(`/billboards/new`)}
                    variant={"default"}
                    size={"lg"}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar billboard
                </Button>
            </div>
            <Separator className="my-4 w-full" />
            <DataTable columns={columns} data={data} searchKey="label" />
            <Heading
                Title="API Billboards"
                Description="Copiar la url para usar API"
            />
            <Separator />
            <ApiList entityName="billboards" entityIdName={"billboardid"} />
        </div>

    )
}

export default BillboardClient