"use client"

import { Button } from "@/components/ui/button";
import { ProductColumns } from "../[productid]/components/colums";
import { toast } from "sonner";
import { Copy, Pencil, Trash } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { ConfirmModal } from "@/components/modals/comfirm-modal";
import { useState, useTransition } from "react";
// import { deleteProduct } from "@/app/actions/product-actions";

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
    product: ProductColumns;
}

const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID Copiado");
}



const CellActions = ({ product }: CellActionsProps) => {

    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();



    // const onDelete = () => {
    //     startTransition(async () => {
    //         try {
    //             const res = await deleteProduct(product.id, params.storeId as string);

    //             if (res?.error) {
    //                 toast.error(res.error);
    //                 return;
    //             }

    //             toast.success("Producto eliminado con éxito");
    //             router.refresh();
    //         } catch (error) {
    //             toast.error("Ocurrió un error al intentar eliminar el producto.");
    //         } finally {
    //             setOpen(false);
    //         }
    //     });
    // };

    return (
        <>
            {/* <ConfirmModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={isPending}
                title="¿Eliminar producto?"
                description="Al eliminar este producto, se marcará como no disponible para compra, afectando así el estado de las órdenes, considera archivarlo si no deseas eliminarlo permanentemente."
            /> */}
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={<Button variant="ghost" className="h-8 w-8 p-0" />}
                >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => onCopy(product.id)}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.push(`/products/${product.id}`)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Update
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setOpen(true)}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            {isPending ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CellActions;