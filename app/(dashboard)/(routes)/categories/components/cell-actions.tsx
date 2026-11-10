//src/app/(dashboard)/[storeId]/(routes)/categories/components/cell-actions.tsx

"use client"

import { Button } from "@/components/ui/button";
import { CategoryColumns } from "../[categoryid]/components/columns";
import { toast } from "sonner";
import { Copy, Pencil, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import axios from "axios"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

interface CellActionsProps {
    category: CategoryColumns & {
        isFeatured: boolean;
    };
}

const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID Copiado");
}

const CellActionsCategory = ({ category }: CellActionsProps) => {

    const router = useRouter();

    const [isLoadingToggle, setIsLoadingToggle] = useState(false);

    const handleToggleStatus = async (field: "isFeatured" | "isArchived", currentValue: boolean) => {
        setIsLoadingToggle(true);
        try {
            const newValue = !currentValue;

            const res = await axios.patch(`/api/v1/admin/landing/categories/${category.id}`, {
                [field]: newValue,
            });

            toast.success(res.data.success || "Estado actualizado correctamente");
            router.refresh();
        } catch (error) {
            console.error("[TOGGLE_STATUS_ERROR]", error);
            toast.error("Hubo un error al actualizar el estado.");
        } finally {
            setIsLoadingToggle(false);
        }
    };

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
                        <DropdownMenuLabel>Actiones</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => onCopy(category.id)}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.push(`/categories/${category.id}`)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Actualizar
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => handleToggleStatus("isFeatured", !!category.isFeatured)}
                            disabled={isLoadingToggle}
                        >
                            <Star className="mr-2 h-4 w-4" />
                            {category.isFeatured ? "Quitar de destacados" : "Marcar como destacado"}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CellActionsCategory;