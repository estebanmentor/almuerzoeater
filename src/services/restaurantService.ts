
'use server';

import { db } from '@/lib/firebase-admin';
import type { Restaurant, Discount, PaymentMethod, MenuItem } from '@/models/restaurant';
import type { Reservation, TakeawayOrder, Transaction } from '@/models/reservation';
import type { CustomerAnalytics, CustomerSegment, CustomerPersona, TakeawayCustomer, ReservationCustomer } from '@/models/analytics';
import type { Notification } from '@/models/notification';


// Simulate a database query delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const DISTANCE_LIMIT = 4; // This would be replaced by a Geo-query parameter

export async function getAllRestaurants(): Promise<Restaurant[]> {
    await delay(50); 
    const restaurantsCol = await db.collection('restaurants').get();
    // Geo-queries are complex and would be done differently in a real app
    const restaurantList = restaurantsCol.docs.map(doc => doc.data() as Restaurant);
    return restaurantList.filter(r => r.distance <= DISTANCE_LIMIT);
}

export async function getRestaurantById(id: string): Promise<Restaurant | undefined> {
    await delay(50);
    const restaurantDoc = await db.collection('restaurants').doc(id).get();
    if (restaurantDoc.exists) {
        const restaurant = restaurantDoc.data() as Restaurant;
        if (restaurant.distance <= DISTANCE_LIMIT) {
             return restaurant;
        }
    }
    return undefined;
}

export async function getFeaturedRestaurants(): Promise<Restaurant[]> {
    await delay(50);
    const restaurantsCol = await db.collection('restaurants').where('isFeatured', '==', true).get();
    const restaurantList = restaurantsCol.docs.map(doc => doc.data() as Restaurant);
    return restaurantList.filter(r => r.distance <= DISTANCE_LIMIT);
}

export async function getSuperOfferRestaurants(): Promise<Restaurant[]> {
    await delay(50);
    const restaurantsCol = await db.collection('restaurants').where('hasSuperOffer', '==', true).get();
    const restaurantList = restaurantsCol.docs.map(doc => doc.data() as Restaurant);
    return restaurantList.filter(r => r.distance <= DISTANCE_LIMIT);
}

export async function getHiddenGemRestaurants(): Promise<Restaurant[]> {
    await delay(50);
    const restaurantsCol = await db.collection('restaurants').where('isHiddenGem', '==', true).get();
    const restaurantList = restaurantsCol.docs.map(doc => doc.data() as Restaurant);
    return restaurantList.filter(r => r.distance <= DISTANCE_LIMIT);
}

export async function getNewRestaurants(): Promise<Restaurant[]> {
    await delay(50);
    const restaurantsCol = await db.collection('restaurants').where('isNew', '==', true).get();
    const restaurantList = restaurantsCol.docs.map(doc => doc.data() as Restaurant);
    return restaurantList.filter(r => r.distance <= DISTANCE_LIMIT);
}

export async function getPromotions(limit: number = 4): Promise<Restaurant[]> {
    await delay(50);
    // This is a simplified query. A real implementation might denormalize this.
    const restaurantsCol = await db.collection('restaurants').get();
    const restaurantList = restaurantsCol.docs.map(doc => doc.data() as Restaurant);
    return restaurantList
        .filter(r => r.discounts && r.discounts.length > 0 && r.distance <= DISTANCE_LIMIT)
        .slice(0, limit);
}

export async function getNearbyRestaurants(maxDistance: number = DISTANCE_LIMIT): Promise<Restaurant[]> {
    await delay(50);
    // This would require a Geo-query in Firebase/Firestore
    const restaurantsCol = await db.collection('restaurants').get();
    const restaurantList = restaurantsCol.docs.map(doc => doc.data() as Restaurant);
    return restaurantList.filter(r => r.distance < maxDistance);
}

export async function getTakeawayRestaurantsWithMenus(): Promise<Restaurant[]> {
    await delay(50);
    const restaurantsCol = await db.collection('restaurants').where('availableServices', 'array-contains', 'Para llevar').get();
    const restaurantList = restaurantsCol.docs.map(doc => doc.data() as Restaurant);
    
    const takeawayRestaurants = restaurantList.filter(r => r.distance <= DISTANCE_LIMIT);

    return takeawayRestaurants.map(restaurant => {
        const menuItems = restaurant.menu.filter(item => item.availableForTakeaway);
        return { ...restaurant, menu: menuItems };
    }).filter(r => r.menu.length > 0);
}

export async function getFavoriteRestaurants(): Promise<Restaurant[]> {
    await delay(50);
    // This would be a user-specific query in Firebase, likely needing a separate 'favorites' collection.
    // Simulating by filtering from all restaurants for now.
    const restaurantsCol = await db.collection('restaurants').where('isFavorite', '==', true).get();
    const restaurantList = restaurantsCol.docs.map(doc => doc.data() as Restaurant);
    return restaurantList.filter(r => r.distance <= DISTANCE_LIMIT);
}

export async function getSubscribedRestaurants(): Promise<Restaurant[]> {
    await delay(50);
    // This would be a user-specific query in Firebase.
    const restaurantsCol = await db.collection('restaurants').where('isSubscribedToDailyMenu', '==', true).get();
    const restaurantList = restaurantsCol.docs.map(doc => doc.data() as Restaurant);
    return restaurantList.filter(r => r.distance <= DISTANCE_LIMIT);
}

// Restaurant Admin Panel Services
export async function getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    await delay(50);
    const restaurantDoc = await db.collection('restaurants').doc(restaurantId).get();
    if(restaurantDoc.exists) {
        return (restaurantDoc.data() as Restaurant).menu || [];
    }
    return [];
}

export async function getDiscountsByRestaurant(restaurantId: string): Promise<Discount[]> {
    await delay(50);
    const restaurantDoc = await db.collection('restaurants').doc(restaurantId).get();
    if(restaurantDoc.exists) {
        return (restaurantDoc.data() as Restaurant).discounts || [];
    }
    return [];
}

export async function getAvailableDiscounts(): Promise<Discount[]> {
    await delay(50);
    const restaurantsCol = await db.collection('restaurants').get();
    const restaurantList = restaurantsCol.docs.map(doc => doc.data() as Restaurant);
    return restaurantList.flatMap(r => r.discounts || []);
}

export async function getReservations(): Promise<Reservation[]> {
    await delay(50);
    const reservationsCol = await db.collection('reservations').get();
    return reservationsCol.docs.map(doc => doc.data() as Reservation);
}

export async function getTakeawayOrders(): Promise<TakeawayOrder[]> {
    await delay(50);
    const ordersCol = await db.collection('takeawayOrders').get();
    return ordersCol.docs.map(doc => doc.data() as TakeawayOrder);
}

export async function getCustomerAnalytics(): Promise<CustomerAnalytics> {
    await delay(50);
    const analyticsDoc = await db.collection('analytics').doc('customerAnalytics').get();
    return analyticsDoc.data() as CustomerAnalytics;
}

export async function getCustomerSegments(): Promise<CustomerSegment[]> {
    await delay(50);
    const segmentsCol = await db.collection('customerSegments').get();
    return segmentsCol.docs.map(doc => doc.data() as CustomerSegment);
}

export async function getCustomerPersonas(): Promise<CustomerPersona[]> {
    await delay(50);
    const personasCol = await db.collection('customerPersonas').get();
    return personasCol.docs.map(doc => doc.data() as CustomerPersona);
}

export async function getTransactions(): Promise<Transaction[]> {
    await delay(50);
    const transactionsCol = await db.collection('transactions').get();
    return transactionsCol.docs.map(doc => doc.data() as Transaction);
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
    await delay(50);
    const paymentsCol = await db.collection('paymentMethods').get();
    return paymentsCol.docs.map(doc => doc.data() as PaymentMethod);
}

export async function getTakeawayCustomers(): Promise<TakeawayCustomer[]> {
    await delay(50);
    // This is a complex aggregation. In a real app, this would be done with a Firebase Function
    // that updates an aggregated collection, or performed on the client with multiple reads.
    // Simulating the result for now after fetching all orders.
    const ordersCol = await db.collection('takeawayOrders').get();
    const orders = ordersCol.docs.map(doc => doc.data() as TakeawayOrder);

    const customerData: { [name: string]: { totalSpent: number; orderCount: number } } = {};

    orders.forEach(order => {
        if (!customerData[order.customerName]) {
            customerData[order.customerName] = { totalSpent: 0, orderCount: 0 };
        }
        customerData[order.customerName].totalSpent += order.total;
        customerData[order.customerName].orderCount++;
    });

    const result: TakeawayCustomer[] = Object.entries(customerData).map(([name, data]) => ({
        name,
        totalSpent: data.totalSpent,
        orderCount: data.orderCount,
        averageOrderValue: Math.round(data.totalSpent / data.orderCount),
    }));

    return result.sort((a, b) => b.totalSpent - a.totalSpent);
}

export async function getReservationCustomers(): Promise<ReservationCustomer[]> {
    await delay(50);
    // Similar to above, this is a complex aggregation.
    const reservationsCol = await db.collection('reservations').get();
    const reservations = reservationsCol.docs.map(doc => doc.data() as Reservation);
    
    const customerData: { [name: string]: { reservationCount: number } } = {};

    reservations.forEach(reservation => {
        if (!customerData[reservation.customerName]) {
            customerData[reservation.customerName] = { reservationCount: 0 };
        }
        customerData[reservation.customerName].reservationCount++;
    });

    const result: ReservationCustomer[] = Object.entries(customerData).map(([name, data]) => ({
        name,
        reservationCount: data.reservationCount,
    }));

    return result.sort((a, b) => b.reservationCount - a.reservationCount);
}

// Full restaurant list for admin panels
export async function getFullRestaurantListForAdmin(): Promise<Restaurant[]> {
    await delay(50);
    const restaurantsCol = await db.collection('restaurants').get();
    return restaurantsCol.docs.map(doc => doc.data() as Restaurant);
}

export async function getNotifications(): Promise<Notification[]> {
    await delay(50);
    const notificationsCol = await db.collection('notifications').get();
    return notificationsCol.docs.map(doc => doc.data() as Notification);
}

export async function getAllCuisines(): Promise<string[]> {
    await delay(50);
    const restaurantsCol = await db.collection('restaurants').get();
    const restaurantList = restaurantsCol.docs.map(doc => doc.data() as Restaurant);
    const cuisines = new Set(restaurantList.map(r => r.cuisine));
    return Array.from(cuisines);
}
