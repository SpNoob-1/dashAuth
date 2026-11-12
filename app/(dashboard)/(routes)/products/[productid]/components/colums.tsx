"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "@/components/ui/data-table-features"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import CellActions from "../../components/cell-actions"
import { CellOrden } from "../../components/cell-orden"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumns = {
    id: string
    name: string
    price: string
    description: string
    category: string
    size: string
    order: number
    isArchived: boolean
    isFeatured: boolean
    createdAt: string
}

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, ProductColumns>()

export const Columns = (
    onMove: (index: number, direction: "up" | "down") => void,
    isLoading: boolean
) => columnHelper.columns([
    columnHelper.accessor("name", {
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nombre
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    }),
    columnHelper.accessor("price", {
        header: "Precio",
    }),
    columnHelper.accessor("category", {
        header: "Categoria",
    }),
    columnHelper.accessor("size", {
        header: "Talla",
    }),
    columnHelper.accessor("isArchived", {
        header: "¿Archvado?",
    }),
    columnHelper.accessor("isFeatured", {
        header: "¿Destacado?",
    }),
    columnHelper.accessor("createdAt", {
        header: "Created At",
    }),
    columnHelper.display({
        id: "actions",
        header: "Actiones",
        cell: ({ row }) => {
            const product = row.original
            return (
                <CellActions product={product} />
            )
        }
    }),
    columnHelper.display({
        id: "orden",
        header: "Orden",
        cell: ({ row }) => {
            return (
                <CellOrden
                    product={row.original}
                    index={row.index}
                    onMove={onMove}
                    disabled={isLoading} />
            )
        }
    }),

])