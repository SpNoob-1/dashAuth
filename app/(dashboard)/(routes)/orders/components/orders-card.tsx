"use client";

import { ArrowRight, XCircle, Loader2, MapPin, Phone, Copy } from "lucide-react";
import { FormattedOrder } from "./main-orders";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OrdersCardProps {
    order: FormattedOrder;
    nextStep?: { nextStateName: string; buttonLabel: string };
    isUpdating: boolean;
    onStatusChange: (orderId: string, targetStateName: string) => void;
}

const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID Copiado");
}

export function OrdersCard({
    order,
    nextStep,
    isUpdating,
    onStatusChange,
}: OrdersCardProps) {
    return (
        <div className="bg-card text-card-foreground rounded-md border p-3.5 shadow-sm flex flex-col gap-3">
            {/* Encabezado de tarjeta: ID + Total */}
            <div className="flex items-start justify-between gap-2">
                <div>
                    <span className="font-mono text-xs font-bold text-primary">
                        #{order.shortId}
                    </span>
                    <p className="font-medium text-sm leading-tight mt-0.5">
                        {order.customerName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{order.createdAt}</p>
                </div>
                <span className="font-semibold text-sm">{order.formattedTotal}</span>
            </div>

            {/* Lista de productos y exclusiones */}
            <div className="border-y py-2 space-y-1.5">
                {order.items.map((item) => (
                    <div key={item.id} className="text-xs">
                        <div className="flex justify-between font-medium">
                            <span>
                                {item.quantity}x {item.productName}
                            </span>
                        </div>
                        {/* Alerta visual para cocina si hay exclusiones */}
                        {item.exclusions.length > 0 && (
                            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium pl-2 border-l-2 border-amber-500 mt-0.5">
                                Sin: {item.exclusions.join(", ")}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Datos de entrega */}
            <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{order.fullAddress}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{order.phone}</span>
                </div>
            </div>

            {/* Botones de acción rápida (solo si no es un estado final) */}
            {!order.status.esFinal && (
                <div className="flex items-center gap-2 pt-1">
                    {nextStep && (
                        <Button
                            disabled={isUpdating}
                            onClick={() => onStatusChange(order.id, nextStep.nextStateName)
                            }
                            variant={"default"}
                        >
                            {isUpdating ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <>
                                    {nextStep.buttonLabel}
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </>
                            )}
                        </Button>
                    )}

                    < Button
                        disabled={isUpdating}
                        onClick={() => onStatusChange(order.id, "CANCELADO")}
                        title="Cancelar pedido"
                        variant={"destructive"}
                    >
                        <XCircle className="h-4 w-4" />
                    </ Button>

                    <Button
                        onClick={() => onCopy(order.id)}
                        variant={"outline"}
                        title="Copiar ID del pedido"
                        size={"icon"}
                    >
                        <Copy className=" h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}