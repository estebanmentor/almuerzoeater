
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { db as mockDb } from '../lib/db';

// IMPORTANT: Download your service account key from Firebase Console
// and save it as `serviceAccountKey.json` in the root of your project.
// Make sure this file is added to .gitignore and is NOT committed to your repository.
const serviceAccount = require('../../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const firestore = getFirestore();

async function uploadCollection(collectionName: string, data: any[]) {
    const collectionRef = firestore.collection(collectionName);
    const batch = firestore.batch();
    
    console.log(`Starting upload for collection: ${collectionName}...`);

    for (const item of data) {
        // Use the existing ID if it has one, otherwise let Firestore generate it
        const docRef = item.id ? collectionRef.doc(String(item.id)) : collectionRef.doc();
        batch.set(docRef, item);
    }
    
    await batch.commit();
    console.log(`Successfully uploaded ${data.length} documents to ${collectionName}.`);
}

async function uploadSingleDocument(collectionName: string, docId: string, data: any) {
    const docRef = firestore.collection(collectionName).doc(docId);
    await docRef.set(data);
    console.log(`Successfully uploaded document to ${collectionName}/${docId}.`);
}


async function migrate() {
  try {
    console.log("Starting database migration...");

    // Upload collections
    await uploadCollection('restaurants', mockDb.restaurants);
    await uploadCollection('reservations', mockDb.reservations);
    await uploadCollection('takeawayOrders', mockDb.takeawayOrders);
    await uploadCollection('contacts', mockDb.contacts);
    await uploadCollection('transactions', mockDb.transactions);
    await uploadCollection('notifications', mockDb.notifications);
    await uploadCollection('paymentMethods', mockDb.paymentMethods);
    await uploadCollection('adminSections', mockDb.adminSections);
    await uploadCollection('dataExtractionJobs', mockDb.dataExtractionJobs);
    await uploadCollection('exampleQueries', mockDb.exampleQueries);
    
    // Upload single documents or objects
    await uploadSingleDocument('analytics', 'customerAnalytics', mockDb.customerAnalytics);
    await uploadCollection('customerSegments', mockDb.customerSegments);
    await uploadCollection('customerPersonas', mockDb.customerPersonas);
    await uploadSingleDocument('admin', 'dashboardMetrics', mockDb.dashboardMetrics);


    console.log("Database migration completed successfully! Your Firestore database is now populated with mock data.");
  } catch (error) {
    console.error("Error during database migration:", error);
    process.exit(1);
  }
}

migrate();
