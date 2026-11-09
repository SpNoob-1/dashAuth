"use client";

import { Button } from "@/components/ui/button";
import { ProductColumns } from "../[productid]/components/colums";
import { toast } from "sonner";
import { Copy, Pencil, Star, Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

import { MoreHorizontal } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface CellActionsProps {
    product: ProductColumns & {
        isFeatured?: boolean;
        isArchived?: boolean;
    };
}

const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID Copiado");
}

const CellActions = ({ product }: CellActionsProps) => {
    const router = useRouter();
    const [isLoadingToggle, setIsLoadingToggle] = useState(false);

    const handleToggleStatus = async (field: "isFeatured" | "isArchived", currentValue: boolean) => {
        setIsLoadingToggle(true);
        try {
            const newValue = !currentValue;

            const res = await axios.patch(`/api/v1/admin/landing/products/${product.id}`, {
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
                <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoadingToggle}>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>}>

                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem onClick={() => onCopy(product.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar ID
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => router.push(`/products/${product.id}`)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Actualizar
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        {/* Opciones rápidas para alternar booleanos */}
                        <DropdownMenuItem
                            onClick={() => handleToggleStatus("isFeatured", !!product.isFeatured)}
                            disabled={isLoadingToggle}
                        >
                            <Star className="mr-2 h-4 w-4" />
                            {product.isFeatured ? "Quitar de destacados" : "Marcar como destacado"}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => handleToggleStatus("isArchived", !!product.isArchived)}
                            disabled={isLoadingToggle}
                        >
                            <CardIcon archived={!!product.isArchived} />
                            {product.isArchived ? "Desarchivar producto" : "Archivar producto"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

// Icono auxiliar para archivo
const CardIcon = ({ archived }: { archived: boolean }) => {
    return <Archive className="mr-2 h-4 w-4" />;
};

export default CellActions;