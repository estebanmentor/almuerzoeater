


export interface Reservation {
    id: string;
    customerName: string;
    time: string;
    date: string;
    people: number;
    status: 'Aceptada' | 'Pendiente' | 'Rechazada' | 'Check-in' | 'Cancelada';
    organizerTrust: number;
    notes?: string;
    phone?: string;
}

export interface TakeawayOrderItem {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number; // Precio al momento de la compra
}

export interface TakeawayOrder {
    id: string;
    customerName: string;
    date: string;
    total: number;
    status: 'Pendiente' | 'En preparación' | 'Listo' | 'Entregado' | 'Cancelado';
    type: 'Para Llevar' | 'Para Servir';
    items: TakeawayOrderItem[];
    notes?: string;
}

export interface Transaction {
    id: string;
    type: 'Comisión' | 'Tarifa de Servicio' | 'Pago a Restaurante' | 'Reembolso';
    amount: number;
    method: 'Stripe' | 'Transferencia';
    status: 'Completado' | 'Procesando' | 'Fallido';
    date: string;
}
