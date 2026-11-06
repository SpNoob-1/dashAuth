"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "@/components/ui/data-table-features"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import CellActions from "../../components/cell-actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumns = {
    id: string
    name: string
    price: string
    category: string
    size: string
    order: number
    isArchived: boolean
    isFeatured: boolean
    createdAt: string
}

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, ProductColumns>()

export const columns = columnHelper.columns([

    columnHelper.accessor("name", {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    }),
    columnHelper.accessor("price", {
        header: "Price",
    }),
    columnHelper.accessor("category", {
        header: "Category",
    }),
    columnHelper.accessor("size", {
        header: "Size",
    }),
    // columnHelper.accessor("color", {
    //     header: "Color",
    //     cell: ({ row }) => (
    //         <div className="flex items-center gap-x-2">
    //             {row.original.color}
    //             <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.color }}></div>
    //         </div>
    //     )
    // }),
    columnHelper.accessor("isArchived", {
        header: "Is Archived",
    }),
    columnHelper.accessor("isFeatured", {
        header: "Is Featured",
    }),
    columnHelper.accessor("createdAt", {
        header: "Created At",
    }),
    columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const product = row.original
            return (
                <CellActions product={product} />
            )
        }
    })




])