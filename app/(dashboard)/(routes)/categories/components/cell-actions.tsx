//src/app/(dashboard)/[storeId]/(routes)/categories/components/cell-actions.tsx

"use client"

import { Button } from "@/components/ui/button";
import { CategoryColumns } from "../[categoryid]/components/columns";
import { toast } from "sonner";
import { Copy, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

interface CellActionsProps {
    data: CategoryColumns;
}

const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID Copiado");
}

const CellActionsCategory = ({ data }: CellActionsProps) => {

    const router = useRouter();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={<Button variant="ghost" className="h-8 w-8 p-0" />}
                >
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => onCopy(data.id)}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.push(`/categories/${data.id}`)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Actualizar
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CellActionsCategory;