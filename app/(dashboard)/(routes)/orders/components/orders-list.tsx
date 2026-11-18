"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormattedOrder, OrderStateOption } from "./main-orders";
import { OrdersCard } from "./orders-card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrdersListProps {
    data: FormattedOrder[];
    states: OrderStateOption[];
}

const KANBAN_COLUMNS = [
    { key: "PENDIENTE", title: "Pendientes", accent: "border-t-amber-500" },
    { key: "EN_PREPARACION", title: "En Preparación", accent: "border-t-blue-500" },
    { key: "LISTO", title: "Listos para Entrega", accent: "border-t-slate-500" },
    { key: "ENTREGADO", title: "Entregados", accent: "border-t-emerald-500" },
    { key: "CANCELADO", title: "Cancelado", accent: "border-t-red-500" }
] as const;

const NEXT_STEP_CONFIG: Record<string, { nextStateName: string; buttonLabel: string }> = {
    PENDIENTE: {
        nextStateName: "EN_PREPARACION",
        buttonLabel: "Preparar",
    },
    EN_PREPARACION: {
        nextStateName: "LISTO",
        buttonLabel: "Marcar Listo",
    },
    LISTO: {
        nextStateName: "ENTREGADO",
        buttonLabel: "Entregar",
    },
};

export function OrdersList({ data, states }: OrdersListProps) {
    const router = useRouter();
    const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

    const handleStatusChange = async (orderId: string, targetStateName: string) => {
        const targetState = states.find((s) => s.nombre === targetStateName);

        if (!targetState) {
            toast.error(`No se encontró el estado ${targetStateName} en la base de datos.`);
            return;
        }

        try {
            setLoadingOrderId(orderId);

            const res = await fetch(`/api/v1/admin/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estadoPedidoId: targetState.id }),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.error || "No se pudo actualizar el pedido");
                return;
            }

            if (targetStateName === "LISTO") {
                toast.success("Pedido marcado como LISTO y se ha enviado el correo al cliente 📧");
            } else {
                toast.success(result.success || `Pedido actualizado a ${targetStateName}`);
            }
            router.refresh();
        } catch {
            toast.error("Error de conexión al actualizar el estado");
        } finally {
            setLoadingOrderId(null);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {KANBAN_COLUMNS.map((column) => {
                const columnOrders = data.filter((order) => order.status.nombre === column.key);

                return (
                    <div
                        key={column.key}
                        className={`bg-muted/40 rounded-lg border border-t-4 ${column.accent} p-3 flex flex-col gap-3`}
                    >
                        {/* Cabecera fija de la columna */}
                        <div className="flex items-center justify-between px-1 shrink-0">
                            <h3 className="font-semibold text-sm tracking-tight">{column.title}</h3>
                            <span className="text-xs font-medium bg-background border px-2 py-0.5 rounded-full">
                                {columnOrders.length}
                            </span>
                        </div>

                        <ScrollArea className="h-[calc(100vh-260px)] min-h-100 pr-3">
                            <div className="flex flex-col gap-3">
                                {columnOrders.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-8">
                                        Sin pedidos en esta etapa
                                    </p>
                                ) : (
                                    columnOrders.map((order) => (
                                        <OrdersCard
                                            key={order.id}
                                            order={order}
                                            nextStep={NEXT_STEP_CONFIG[order.status.nombre]}
                                            isUpdating={loadingOrderId === order.id}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                );
            })}
        </div>
    );
}