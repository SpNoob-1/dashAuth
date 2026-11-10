"use client"


import { Button } from "@/components/ui/button";
import { SizeColumns } from "../[sizeid]/components/columns"
import { toast } from "sonner";
import { Copy, Pencil, Trash } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
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
    data: SizeColumns;
}

const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID Copiado");
}



const CellActionsSize = ({ data }: CellActionsProps) => {

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
                            onClick={() => router.push(`/sizes/${data.id}`)}
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

export default CellActionsSize;