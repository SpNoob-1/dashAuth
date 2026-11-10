"use client"


import { Button } from "@/components/ui/button";
import { SectionColumns } from "../[sectionid]/components/columns"
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
    section: SectionColumns & {
        isActive?: boolean
    }
}

const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID Copiado");
}



const CellActionsSection = ({ section }: CellActionsProps) => {

    const router = useRouter();

    const [isLoadingToggle, setIsLoadingToggle] = useState(false);

    const handleToggleStatus = async (field: "isActive", currentValue: boolean) => {
        setIsLoadingToggle(true);
        try {
            const newValue = !currentValue;

            const res = await axios.patch(`/api/v1/admin/landing/sections/${section.id}`, {
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => onCopy(section.id)}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.push(`/sections/${section.id}`)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Actualizar
                        </DropdownMenuItem>
                        {/* Opciones rápidas para alternar booleanos */}
                        <DropdownMenuItem
                            onClick={() => handleToggleStatus("isActive", !!section.isActive)}
                            disabled={isLoadingToggle}
                        >
                            <Star className="mr-2 h-4 w-4" />
                            {section.isActive ? "Quitar de destacados" : "Marcar como destacado"}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CellActionsSection;