"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "@/components/ui/data-table-features"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import CellActionsSize from "../../components/cell-actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SizeColumns = {
    id: string
    name: string
    value: string
    createdAt: string
}

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, SizeColumns>()

export const columns = columnHelper.columns([

    columnHelper.accessor("name", {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    }),
    columnHelper.accessor("value", {
        header: "Valor",
    }),
    columnHelper.accessor("createdAt", {
        header: "Created At",
    }),
    columnHelper.display({
        id: "actions",
        header: "Actiones",
        cell: ({ row }) => {
            const size = row.original
            return (
                <CellActionsSize data={size} />
            )
        }
    })




])