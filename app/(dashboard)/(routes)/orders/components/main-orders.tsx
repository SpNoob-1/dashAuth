"use client";

import Heading from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/api-list";
import { OrdersList } from "./orders-list";

export interface FormattedOrderItem {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    exclusions: string[];
}

export interface FormattedOrder {
    id: string;
    shortId: string;
    customerName: string;
    customerEmail: string;
    phone: string;
    fullAddress: string;
    addressAlias: string;
    addressDetails: string | null;
    isPaid: boolean;
    status: {
        id: string;
        nombre: string;
        esFinal: boolean;
    };
    total: number;
    formattedTotal: string;
    items: FormattedOrderItem[];
    createdAt: string;
}

export interface OrderStateOption {
    id: string;
    nombre: string;
    esFinal: boolean;
}

interface OrdersKanbanProps {
    data: FormattedOrder[];
    states: OrderStateOption[];
}

const MainOrders = ({ data, states }: OrdersKanbanProps) => {
    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center justify-between w-full">
                <Heading
                    Title={`Pedidos (${data.length})`}
                    Description="Gestiona el flujo de preparación y entrega de pedidos"
                />
            </div>
            <Separator className="my-4 w-full" />
            <OrdersList data={data} states={states} />

            <div className="pt-6">
                <Heading
                    Title="API Pedidos"
                    Description="Endpoints disponibles para gestión de órdenes"
                />
                <Separator className="my-4" />
                <ApiList entityName="orders" entityIdName="orderid" />
            </div>
        </div>
    );
};

export default MainOrders;