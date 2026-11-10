"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "@/components/ui/data-table-features"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import CellActionsSection from "../../components/cell-actions"
import { CellOrden } from "../../components/cell-orden"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SectionColumns = {
    id: string
    key: string
    title: string
    order: number
    isActive: boolean
    subtitle: string
    createdAt: string
}

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, SectionColumns>()

export const Columns = (
    onMove: (index: number, direction: "up" | "down") => void,
    isLoading: boolean
) => columnHelper.columns([

    columnHelper.accessor("key", {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Clave
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    }),
    columnHelper.accessor("title", {
        header: "Titulo",
    })
    , columnHelper.accessor("subtitle", {
        header: "Subtitulo",
    }), columnHelper.accessor("isActive", {
        header: "¿Activo?",
    }),
    columnHelper.accessor("createdAt", {
        header: "created_At",
    }),
    columnHelper.display({
        id: "actions",
        header: "Actiones",
        cell: ({ row }) => {
            const section = row.original
            return (
                <CellActionsSection section={section} />
            )
        }
    }),
    columnHelper.display({
        id: "orden",
        header: "Orden",
        cell: ({ row }) => {
            return (
                <CellOrden
                    section={row.original}
                    index={row.index}
                    onMove={onMove}
                    disabled={isLoading} />
            )
        }
    })
])