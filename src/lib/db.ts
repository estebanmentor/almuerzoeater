
import type { Restaurant } from '@/models/restaurant';
import type { Reservation, TakeawayOrder, Transaction } from '@/models/reservation';
import type { Contact } from '@/models/contact';
import type { Notification } from '@/models/notification';
import type { PaymentMethod } from '@/models/restaurant';
import type { AdminSection, DashboardMetricCard, DataExtractionJob, ExampleQuery } from '@/models/admin';
import type { CustomerAnalytics, CustomerSegment, CustomerPersona, TakeawayCustomer, ReservationCustomer } from '@/models/analytics';
import { format } from 'date-fns';

const today = new Date();

const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Pizzería Del Fuego",
    address: "Av. Providencia 123",
    location: { lat: -33.4372, lon: -70.6293 },
    imageUrl: "https://storage.googleapis.com/almuerzopublico.firebasestorage.app/restaurants/pizzeria.png",
    imageHint: "pizza oven",
    distance: 0.5,
    cuisine: "Italiana",
    menu: [
      { id: "p1", restaurantId: "1", name: "Pizza Margherita", description: "La clásica pizza con tomate, mozzarella y albahaca.", regularPrice: 8500, availableForTakeaway: true, imageUrl: "https://storage.googleapis.com/almuerzopublico.firebasestorage.app/dishes/margherita.png", imageHint: "margherita pizza" },
      { id: "p2", restaurantId: "1", name: "Pizza Pepperoni", description: "La favorita de todos con pepperoni picante.", regularPrice: 9500, availableForTakeaway: true, imageUrl: "https://storage.googleapis.com/almuerzopublico.firebasestorage.app/dishes/pepperoni.png", imageHint: "pepperoni pizza" },
      { id: "p3", restaurantId: "1", name: "Lasaña Boloñesa", description: "Capas de pasta con nuestra rica salsa boloñesa.", regularPrice: 10500, availableForTakeaway: false, imageUrl: "https://storage.googleapis.com/almuerzopublico.firebasestorage.app/dishes/lasagna.png", imageHint: "bolognese lasagna" },
    ],
    rating: { google: 4.5, userCount: 120 },
    paymentMethods: ["Efectivo", "Tarjeta de Crédito", "Sodexo"],
    isNew: true,
    isHiddenGem: false,
    isSponsored: true,
    isFeatured: true,
    hasSuperOffer: true,
    priceLevel: 2,
    almuerzoRating: 4.8,
    isFavorite: true,
    isSubscribedToDailyMenu: true,
    availableServices: ["Para servir", "Para llevar"],
    noShowPolicyMinutes: 15,
    takeawayTimeMinutes: 20
  },
  {
    id: "2",
    name: "Sushi Go",
    address: "Calle del Sol 456",
    location: { lat: -33.4380, lon: -70.6310 },
    imageUrl: "https://storage.googleapis.com/almuerzopublico.firebasestorage.app/restaurants/sushi.png",
    imageHint: "sushi rolls",
    distance: 1.2,
    cuisine: "Japonesa",
    menu: [
      { id: "s1", restaurantId: "2", name: "California Roll (8 piezas)", description: "Kanikama, palta y pepino envuelto en sésamo.", regularPrice: 7000, availableForTakeaway: true, imageUrl: "https://storage.googleapis.com/almuerzopublico.firebasestorage.app/dishes/california_roll.png", imageHint: "california roll" },
      { id: "s2", restaurantId: "2", name: "Gyoza de Cerdo (5 piezas)", description: "Empanaditas japonesas al vapor o fritas.", regularPrice: 5500, availableForTakeaway: true, imageUrl: "https://storage.googleapis.com/almuerzopublico.firebasestorage.app/dishes/gyoza.png", imageHint: "pork gyoza" },
    ],
    rating: { google: 4.8, userCount: 250 },
    paymentMethods: ["Tarjeta de Crédito", "Débito", "Edenred"],
    isNew: false,
    isHiddenGem: true,
    isSponsored: false,
    isFeatured: true,
    hasSuperOffer: false,
    priceLevel: 3,
    almuerzoRating: 4.9,
    isFavorite: true,
    isSubscribedToDailyMenu: false,
    availableServices: ["Para llevar"],
    takeawayTimeMinutes: 15,
  },
  {
    id: "3",
    name: "El Rincón Vegano",
    address: "Pasaje Verde 789",
    location: { lat: -33.4365, lon: -70.6280 },
    imageUrl: "https://storage.googleapis.com/almuerzopublico.firebasestorage.app/restaurants/vegan.png",
    imageHint: "vegan food",
    distance: 0.8,
    cuisine: "Vegana",
    menu: [
      { id: "v1", restaurantId: "3", name: "Hamburguesa de Lentejas", description: "Deliciosa hamburguesa casera con papas rústicas.", regularPrice: 8900, availableForTakeaway: true, imageUrl: "https://storage.googleapis.com/almuerzopublico.firebasestorage.app/dishes/lentil_burger.png", imageHint: "lentil burger" },
      { id: "v2", restaurantId: "3", name: "Bowl de Falafel", description: "Falafel, hummus, ensalada y pan pita.", regularPrice: 9200, availableForTakeaway: true, imageUrl: "https://storage.googleapis.com/almuerzopublico.firebasestorage.app/dishes/falafel_bowl.png", imageHint: "falafel bowl" },
    ],
    rating: { google: 4.9, userCount: 95 },
    paymentMethods: ["Tarjeta de Crédito", "Amipass"],
    isNew: true,
    isHiddenGem: true,
    isSponsored: false,
    isFeatured: false,
    hasSuperOffer: false,
    priceLevel: 2,
    isFavorite: false,
    isSubscribedToDailyMenu: true,
    availableServices: ["Para servir", "Para llevar"],
    takeawayTimeMinutes: 10,
  },
   {
    id: "4",
    name: "La Pica' de la Esquina",
    address: "San Martín 321",
    location: { lat: -33.4401, lon: -70.6352 },
    imageUrl: "https://storage.googleapis.com/almuerzopublico.firebasestorage.app/restaurants/pica.png",
    imageHint: "chilean food",
    distance: 2.1,
    cuisine: "Chilena",
    menu: [
      { id: "c1", restaurantId: "4", name: "Lomo a lo Pobre", description: "Bistec de lomo, papas fritas, cebolla frita y dos huevos.", regularPrice: 12000, salePrice: 10000, availableForTakeaway: true, imageUrl: "https://storage.googleapis.com/almuerzopublico.firebasestorage.app/dishes/lomo_pobre.png", imageHint: "lomo a lo pobre" },
      { id: "c2", restaurantId: "4", name: "Pastel de Choclo", description: "El clásico de la abuela, con pino de carne y pollo.", regularPrice: 11000, availableForTakeaway: true, imageUrl: "https://storage.googleapis.com/almuerzopublico.firebasestorage.app/dishes/pastel_choclo.png", imageHint: "pastel de choclo" },
    ],
    rating: { google: 4.3, userCount: 500 },
    paymentMethods: ["Efectivo", "Débito"],
    isNew: false,
    isHiddenGem: false,
    isSponsored: false,
    isFeatured: true,
    hasSuperOffer: true,
    priceLevel: 1,
    isFavorite: false,
    discounts: [
      { sponsor: "Coca-Cola", type: "%", amount: 15, validFrom: format(new Date(), 'yyyy-MM-dd'), validTo: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), daysOfWeek: ["Lunes", "Martes", "Miércoles"], appliesTo: "Todo el menú" }
    ],
    availableServices: ["Para servir", "Para llevar"],
    takeawayTimeMinutes: 25,
  }
];

const reservations: Reservation[] = [
  { id: "res1", customerName: "Juan Pérez", time: "13:00", date: format(today, 'yyyy-MM-dd'), people: 4, status: "Aceptada", organizerTrust: 95, notes: "Mesa cerca de la ventana, por favor." },
  { id: "res2", customerName: "Ana Gómez", time: "13:30", date: format(today, 'yyyy-MM-dd'), people: 2, status: "Pendiente", organizerTrust: 80 },
  { id: "res3", customerName: "Carlos Soto", time: "14:00", date: format(today, 'yyyy-MM-dd'), people: 6, status: "Check-in", organizerTrust: 99, notes: "Celebración de cumpleaños." },
];

const takeawayOrders: TakeawayOrder[] = [
  { 
    id: "ord1",
    customerName: "Sofía Castro",
    date: format(today, 'yyyy-MM-dd'),
    total: 16500,
    status: 'Listo',
    type: 'Para Llevar',
    items: [
      { menuItemId: "p1", name: "Pizza Margherita", quantity: 1, price: 8500 },
      { menuItemId: "s2", name: "Gyoza de Cerdo", quantity: 1, price: 5500 },
    ],
    notes: "Sin orégano en la pizza."
  },
   { 
    id: "ord2",
    customerName: "Martín Rojas",
    date: format(today, 'yyyy-MM-dd'),
    total: 9500,
    status: 'En preparación',
    type: 'Para Llevar',
    items: [
      { menuItemId: "p2", name: "Pizza Pepperoni", quantity: 1, price: 9500 }
    ],
  },
];

const contacts: Contact[] = [
    { id: '1', name: 'Juan Pérez', source: 'Teléfono', phone: '+56911111111', avatarUrl: 'https://storage.googleapis.com/almuerzopublico.firebasestorage.app/avatars/juan_perez.png' },
    { id: '2', name: 'María González', source: 'WhatsApp', phone: '+56922222222', avatarUrl: 'https://storage.googleapis.com/almuerzopublico.firebasestorage.app/avatars/maria_gonzalez.png' },
    { id: '3', name: 'Carlos Soto', source: 'Telegram', username: '@carlossoto', avatarUrl: 'https://storage.googleapis.com/almuerzopublico.firebasestorage.app/avatars/carlos_soto.png' },
    { id: '4', name: 'Ana Flores', source: 'Instagram', username: 'anaflor', profileUrl: 'https://instagram.com/anaflor' },
    { id: '5', name: 'Pedro Pascal', source: 'Facebook', profileUrl: 'https://facebook.com/pedropascal' },
    { id: '6', name: 'Sofía Castro', source: 'Email', email: 'sofia.castro@email.com', avatarUrl: 'https://storage.googleapis.com/almuerzopublico.firebasestorage.app/avatars/sofia_castro.png' },
    { id: '7', name: 'Luisa Martinez', source: 'Teléfono', phone: '+56977777777' },
    { id: '8', name: 'Andrés Rojas', source: 'WhatsApp', phone: '+56988888888' },
];

const transactions: Transaction[] = [
    { id: "txn1", type: "Comisión", amount: -825, method: "Stripe", status: "Completado", date: format(today, 'yyyy-MM-dd') },
    { id: "txn2", type: "Pago a Restaurante", amount: -15675, method: "Transferencia", status: "Procesando", date: format(today, 'yyyy-MM-dd') },
];

const notifications: Notification[] = [
    { id: "not1", title: "¡Reserva Confirmada!", description: "Tu reserva en Pizzería Del Fuego para 4 personas a las 13:00 ha sido confirmada.", time: "Hace 5 minutos", read: false },
    { id: "not2", title: "Menú del Día - Sushi Go", description: "¡Hoy 2x1 en todos los rolls! Revisa el menú y haz tu pedido.", time: "Hace 1 hora", read: false },
    { id: "not3", title: "¡Gracias por tu visita!", description: "¿Cómo estuvo tu almuerzo en El Rincón Vegano? ¡Déjanos tu calificación!", time: "Ayer", read: true },
];

const paymentMethods: PaymentMethod[] = [
    { id: "pm1", label: "Visa Débito **** 4567", type: "Tarjeta", details: "Débito" },
    { id: "pm2", label: "Sodexo Junaeb", type: "Beneficio", details: "Tarjeta de Alimentación" },
    { id: "pm3", label: "Edenred", type: "Beneficio", details: "Restaurant Pass" },
];

const adminSections: AdminSection[] = [
    { href: "/manager/dashboard", icon: "LayoutDashboard", label: "Dashboard General", description: "Visión global de la plataforma." },
    { href: "/manager/users", icon: "Users", label: "Gestión de Usuarios", description: "Administra usuarios y permisos." },
    { href: "/manager/restaurants", icon: "Utensils", label: "Gestión de Restaurantes", description: "Administra restaurantes asociados." },
    { href: "/manager/reports", icon: "BarChart3", label: "Reportes y Analítica", description: "Visualiza datos y tendencias." },
    { href: "/manager/finances", icon: "Banknote", label: "Finanzas", description: "Supervisa transacciones y comisiones." },
    { href: "/manager/settings", icon: "Settings", label: "Configuración", description: "Ajustes globales de la plataforma." },
];

const dataExtractionJobs: DataExtractionJob[] = [
    { id: 'de1', label: 'Extraer logos de restaurantes desde sus sitios web', icon: 'Image' },
    { id: 'de2', label: 'Obtener coordenadas geográficas a partir de direcciones', icon: 'MapPin' },
    { id: 'de3', label: 'Escanear menús en PDF para digitalizar platos', icon: 'FileScan' },
    { id: 'de4', label: 'Analizar reseñas de Google para identificar platos populares', icon: 'Star' },
];

const exampleQueries: ExampleQuery[] = [
    { title: '¿Cuáles son los 5 restaurantes mejor calificados?', query: 'Muestra los 5 restaurantes con la mejor calificación de Google.' },
    { title: '¿Qué nuevos restaurantes veganos hay?', query: 'Busca restaurantes nuevos que sean de cocina vegana.' },
    { title: 'Restaurantes con ofertas de pizza para hoy.', query: 'Encuentra ofertas de pizza en restaurantes cercanos para hoy.' },
];

const customerAnalytics: CustomerAnalytics = {
    funnel: {
        profileViews: 1250,
        menuInteractions: 800,
        addedToFavorites: 250,
        reservations: 120,
        takeawayOrders: 300,
    },
    habits: {
        spendingDistribution: [
            { name: '< $5.000', value: 20 },
            { name: '$5.000 - $10.000', value: 55 },
            { name: '$10.000 - $15.000', value: 20 },
            { name: '> $15.000', value: 5 },
        ],
        topDishes: [
            { name: 'Pizza Pepperoni', value: 150 },
            { name: 'California Roll', value: 120 },
            { name: 'Hamburguesa de Lentejas', value: 90 },
        ],
        hourlyActivity: [
            { name: '12:00', value: 100 },
            { name: '13:00', value: 250 },
            { name: '14:00', value: 150 },
            { name: '15:00', value: 50 },
        ],
        dailyActivity: [
            { name: 'Lun', value: 180 },
            { name: 'Mar', value: 200 },
            { name: 'Mié', value: 220 },
            { name: 'Jue', value: 250 },
            { name: 'Vie', value: 300 },
        ],
    },
    segments: [],
    personas: []
};

const customerSegments: CustomerSegment[] = [
    { segment: 'Cazadores de Ofertas', value: 35 },
    { segment: 'Planificadores Sociales', value: 25 },
    { segment: 'Foodies Apurados', value: 20 },
    { segment: 'Exploradores Gourmet', value: 15 },
    { segment: 'Leales al Local', value: 5 },
];

const customerPersonas: CustomerPersona[] = [
    {
        name: 'El Oficinista Apurado',
        description: 'Busca un almuerzo rápido, bueno y cerca de la oficina. Valora las opciones para llevar.',
        icon: 'Briefcase',
        preferences: { spends: 'Moderado', speed: 'Rápida', ordering: 'Para llevar' },
        motivations: 'Eficiencia, conveniencia y variedad diaria.',
        painPoints: 'Poco tiempo, filas largas, opciones aburridas.',
        engagement: 'Usa la app casi a diario, pide para llevar, rara vez reserva.'
    },
    {
        name: 'El Influencer Foodie',
        description: 'Siempre busca el lugar nuevo y "aesthetic" para compartir en redes. Le encantan las "joyas ocultas".',
        icon: 'Camera',
        preferences: { spends: 'Alto', speed: 'Lenta', ordering: 'Para servir' },
        motivations: 'Novedad, estética del lugar y del plato, calidad gourmet.',
        painPoints: 'Lugares masificados, mala iluminación para fotos.',
        engagement: 'Usa la app para descubrir, reserva en nuevos locales, deja reseñas detalladas.'
    },
    {
        name: 'El Padre de Familia',
        description: 'Organiza almuerzos de fin de semana. Busca lugares con espacio y opciones para niños.',
        icon: 'Baby',
        preferences: { spends: 'Variable', speed: 'Lenta', ordering: 'Para servir' },
        motivations: 'Comodidad, ambiente familiar, buena relación precio-calidad.',
        painPoints: 'Locales pequeños, sin menú infantil, mal servicio.',
        engagement: 'Usa la app para planificar, reserva con anticipación, valora la confianza.'
    }
];

const dashboardMetrics = {
    users: [
        { title: 'Usuarios Activos', value: '1,250', comparison: '+15% vs mes anterior', icon: 'Users', trend: 'up' },
        { title: 'Nuevos Registros', value: '320', comparison: '+5% vs mes anterior', icon: 'UserPlus', trend: 'up' },
    ],
    restaurants: [
        { title: 'Restaurantes Asociados', value: '85', comparison: '+2 nuevos esta semana', icon: 'Utensils', trend: 'up' },
        { title: 'Reservas Totales', value: '540', comparison: '+22% vs mes anterior', icon: 'Calendar', trend: 'up' },
    ],
    financials: [
        { title: 'Ingresos por Comisión', value: '$1,230', comparison: '+18% vs mes anterior', icon: 'Banknote', trend: 'up' },
        { title: 'Ticket Promedio', value: '$12,50', comparison: '-2% vs mes anterior', icon: 'DollarSign', trend: 'down' },
    ],
    platform: [
        { title: 'Búsquedas IA', value: '2,800', comparison: '+30% vs mes anterior', icon: 'Sparkles', trend: 'up' },
        { title: 'Tasa de Conversión (Reserva)', value: '8.5%', comparison: '+0.5% vs mes anterior', icon: 'CheckCircle', trend: 'up' },
    ]
};


export const db = {
  restaurants,
  reservations,
  takeawayOrders,
  contacts,
  transactions,
  notifications,
  paymentMethods,
  adminSections,
  dataExtractionJobs,
  exampleQueries,
  customerAnalytics,
  customerSegments,
  customerPersonas,
  dashboardMetrics,
};

    