
export interface AdminSection {
    href: string;
    icon: string;
    label: string;
    description: string;
}

export interface DashboardMetricCard {
    title: string;
    value: string;
    comparison: string;
    icon: string;
    trend: 'up' | 'down' | 'neutral';
}

export interface DataExtractionJob {
    id: string;
    label: string;
    icon: string;
}

export interface ExampleQuery {
    title: string;
    query: string;
}
