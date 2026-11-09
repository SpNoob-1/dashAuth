//src/app/(dashboard)/[storeId]/(routes)/categories/[categoryID]/components/columns.tsx

"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "@/components/ui/data-table-features"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import CellActionsCategory from "../../components/cell-actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumns = {
    id: string
    name: string
    billboardLabel: string;
    createdAt: string
}

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, CategoryColumns>()

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
    columnHelper.accessor("billboardLabel", {
        header: "Billboard",
        cell: ({ row }) => {
            return row.original.billboardLabel
        }
    }),
    columnHelper.accessor("createdAt", {
        header: "Created At",
    }),
    columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const category = row.original
            return (
                <CellActionsCategory data={category} />
            )
        }
    })
])