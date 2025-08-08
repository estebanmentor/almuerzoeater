

export interface CustomerFunnel {
    profileViews: number;
    menuInteractions: number;
    addedToFavorites: number;
    reservations: number;
    takeawayOrders: number;
}

export interface ChartDataPoint {
    name: string;
    value: number;
}

export interface HabitsData {
    spendingDistribution: ChartDataPoint[];
    topDishes: ChartDataPoint[];
    hourlyActivity: ChartDataPoint[];
    dailyActivity: ChartDataPoint[];
}

export interface CustomerPersona {
    name: string;
    description: string;
    icon: string;
    preferences: {
        spends: string;
        speed: string;
        ordering: string;
    };
    motivations: string;
    painPoints: string;
    engagement: string;
}

export interface CustomerSegment {
    segment: string;
    value: number;
}

export interface CustomerAnalytics {
    funnel: CustomerFunnel;
    habits: HabitsData;
    segments: CustomerSegment[];
    personas: CustomerPersona[];
}

export interface TakeawayCustomer {
    name: string;
    totalSpent: number;
    orderCount: number;
    averageOrderValue: number;
}

export interface ReservationCustomer {
    name: string;
    reservationCount: number;
}
