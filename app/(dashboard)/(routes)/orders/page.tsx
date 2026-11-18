import { db } from "@/index";
import { orders, users, ordersStates, orderItems, exclusionsDetail, products } from "@/db/schema";
import MainOrders from "./components/main-orders";
import { desc, eq } from "drizzle-orm";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const OrdersPage = async () => {
    const ordersPromise = db
        .select({
            order: orders,
            estado: ordersStates,
            user: {
                id: users.id,
                name: users.name,
                email: users.email,
            },
        })
        .from(orders)
        .leftJoin(ordersStates, eq(orders.estadoPedidoId, ordersStates.id))
        .leftJoin(users, eq(orders.userId, users.id))
        .orderBy(desc(orders.createdAt));

    const orderItemsPromise = db
        .select({
            item: orderItems,
            product: {
                id: products.id,
                name: products.name,
            },
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id));

    const exclusionsPromise = db.select().from(exclusionsDetail);

    const statesPromise = db.select().from(ordersStates);

    const [ordersList, orderItemsList, exclusionsList, statesList] = await Promise.all([
        ordersPromise,
        orderItemsPromise,
        exclusionsPromise,
        statesPromise,
    ]);

    // 1. Agrupamos exclusiones por orderItemId
    const exclusionsByItem = new Map<string, string[]>();
    for (const exc of exclusionsList) {
        const current = exclusionsByItem.get(exc.orderItemId) || [];
        current.push(exc.reason);
        exclusionsByItem.set(exc.orderItemId, current);
    }

    // 2. Agrupamos ítems por orderId
    const itemsByOrder = new Map<string, {
        id: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        exclusions: string[];
    }[]>();

    for (const row of orderItemsList) {
        const current = itemsByOrder.get(row.item.orderId) || [];
        current.push({
            id: row.item.id,
            productName: row.product?.name || "Producto eliminado",
            quantity: row.item.quantity,
            unitPrice: Number(row.item.price),
            exclusions: exclusionsByItem.get(row.item.id) || [],
        });
        itemsByOrder.set(row.item.orderId, current);
    }

    // 3. Mapeamos las órdenes formateadas
    const formattedOrders = ordersList.map((row) => {
        const items = itemsByOrder.get(row.order.id) || [];
        const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

        return {
            id: row.order.id,
            shortId: row.order.id.slice(0, 8).toUpperCase(),
            customerName: row.user?.name || "Cliente",
            customerEmail: row.user?.email || "Sin correo",
            phone: row.order.phone || "Sin teléfono",
            fullAddress: `${row.order.addressStreet}, ${row.order.municipioName}`,
            addressAlias: row.order.addressAlias,
            addressDetails: row.order.addressDetails,
            isPaid: row.order.isPaid,
            status: {
                id: row.estado?.id || row.order.estadoPedidoId,
                nombre: row.estado?.nombre || "DESCONOCIDO",
                esFinal: row.estado?.esFinal ?? false,
            },
            total,
            formattedTotal: `Q${total.toFixed(2)}`,
            items,
            createdAt: format(row.order.createdAt, "dd 'de' MMM, yyyy - HH:mm", { locale: es }),
        };
    });

    // 4. Formateamos los estados para el cliente
    const formattedStates = statesList.map((s) => ({
        id: s.id,
        nombre: s.nombre,
        esFinal: s.esFinal,
    }));

    return (
        <div className="flex-col w-full">
            <div className="flex-1 space-y-4 px-6 py-6">
                <MainOrders data={formattedOrders} states={formattedStates} />
            </div>
        </div>
    );
};

export default OrdersPage;