

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  regularPrice: number;
  salePrice?: number;
  rating?: number;
  imageUrl: string;
  imageHint?: string;
  availableForTakeaway: boolean;
  isVegan?: boolean;
  isFeatured?: boolean;
  stock?: number;
}

export interface Discount {
  sponsor: string;
  type: '$' | '%';
  amount: number;
  validFrom: string; 
  validTo: string;
  daysOfWeek: string[];
  appliesTo: string;
  description?: string;
}

export interface Event {
  title: string;
  description: string;
}

export type ServiceType = 'Para servir' | 'Para llevar' | 'Subscripción' | 'Envío de menu diario a interesados';

export interface EventAvailability {
  autoAcceptUpTo4: boolean;
  autoAccept5to7: boolean;
  autoAccept8to16: boolean;
  autoAccept17plus: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lon: number;
  };
  imageUrl: string;
  distance: number;
  cuisine: string;
  menu: MenuItem[];
  rating: {
    google: number;
    userCount: number;
  };
  paymentMethods: string[];
  isNew: boolean;
  isHiddenGem: boolean;
  isSponsored: boolean;
  isFeatured: boolean;
  discounts?: Discount[];
  maxOffers?: number;
  hasSuperOffer: boolean;
  priceLevel: 1 | 2 | 3 | 4;
  almuerzoRating?: number;
  event?: Event;
  isFavorite: boolean;
  availableServices: ServiceType[];
  eventAvailability?: EventAvailability;
  notifyIfFull?: boolean;
  isSubscribedToDailyMenu?: boolean;
  noShowPolicyMinutes?: number;
  takeawayTimeMinutes?: number;
}

export interface PaymentMethod {
    id: string;
    label: string;
    type: string;
    details: string;
}

    