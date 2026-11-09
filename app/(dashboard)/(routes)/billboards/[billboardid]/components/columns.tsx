"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "@/components/ui/data-table-features"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import CellActions from "../../components/cell-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumns = {
    id: string
    label: string
    createdAt: string
}

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, BillboardColumns>()

export const columns = columnHelper.columns([

    columnHelper.accessor("label", {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Label
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    }),
    columnHelper.accessor("createdAt", {
        header: "Created At",
    }),
    columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const billboard = row.original
            return (
                <CellActions data={billboard} />
            )
        }
    })




])