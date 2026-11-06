"use client";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter, useParams } from "next/navigation";
import { products } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { DataTable } from "@/components/ui/data-table";
import { ProductColumns, columns } from "../[productid]/components/colums";
import { ApiList } from "@/components/api-list";
export type Product = InferSelectModel<typeof products>;

interface ProductClientProps {
    data: ProductColumns[];
}


const ProductClient = ({ data }: ProductClientProps) => {
    const router = useRouter();
    const params = useParams();
    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center justify-between w-full">
                <Heading
                    Title={`Products (${data.length})`}
                    Description="Manage your store's products"
                />

                <Button
                    onClick={() => router.push(`/products/new`)}
                    variant={"default"}
                    size={"lg"}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>
            <Separator className="my-4 w-full" />
            <DataTable columns={columns} data={data} searchKey="name" />
            <Heading
                Title="API Products"
                Description="Copy the URL to use the API"
            />
            <Separator />
            <ApiList entityName="products" entityIdName={"productID"} />
        </div>

    )
}

export default ProductClient