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