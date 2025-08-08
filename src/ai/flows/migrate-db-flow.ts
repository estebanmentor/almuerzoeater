// The database migration flow.
//
// This file defines a Genkit flow that populates the Firestore database
// with mock data from the `src/lib/db.ts` file. This is triggered
// manually from a dedicated page in the application.
//
// - migrateDatabase - A function that triggers the migration process.
// - MigrateDatabaseOutput - The return type for the migrateDatabase function.

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db as mockDb } from '@/lib/db';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Define output schema for the flow
const MigrateDatabaseOutputSchema = z.object({
  success: z.boolean(),
  message: z.string().describe('A confirmation or error message.'),
  collections: z.array(z.object({
    name: z.string(),
    documents: z.number(),
  })).describe('Summary of migrated collections.'),
});
export type MigrateDatabaseOutput = z.infer<typeof MigrateDatabaseOutputSchema>;

// Initialize Firebase Admin SDK if not already initialized
if (getApps().length === 0) {
  try {
    const serviceAccount = require('../../../serviceAccountKey.json');
    initializeApp({
      credential: cert(serviceAccount)
    });
  } catch (error: any) {
    console.error("Firebase Admin SDK initialization failed in migrate-db-flow:", error);
    // This will likely cause the flow to fail, which is expected if the key is missing.
  }
}
const firestore = getFirestore();

// Helper function to upload a collection
async function uploadCollection(collectionName: string, data: any[]) {
    const collectionRef = firestore.collection(collectionName);
    const batch = firestore.batch();
    
    if (!data || data.length === 0) {
      console.log(`Skipping upload for empty collection: ${collectionName}`);
      return;
    }

    for (const item of data) {
        const docRef = item.id ? collectionRef.doc(String(item.id)) : collectionRef.doc();
        batch.set(docRef, JSON.parse(JSON.stringify(item))); // Ensure plain objects
    }
    
    await batch.commit();
}

// Helper function to upload a single document
async function uploadSingleDocument(collectionName: string, docId: string, data: any) {
    if (!data) {
        console.log(`Skipping upload for empty document: ${collectionName}/${docId}`);
        return;
    }
    const docRef = firestore.collection(collectionName).doc(docId);
    await docRef.set(JSON.parse(JSON.stringify(data)));
}

// The main migration flow
const migrateDatabaseFlow = ai.defineFlow(
  {
    name: 'migrateDatabaseFlow',
    inputSchema: z.undefined(),
    outputSchema: MigrateDatabaseOutputSchema,
  },
  async () => {
    try {
      console.log("Starting database migration from flow...");

      const collectionsToMigrate = {
        restaurants: mockDb.restaurants,
        reservations: mockDb.reservations,
        takeawayOrders: mockDb.takeawayOrders,
        contacts: mockDb.contacts,
        transactions: mockDb.transactions,
        notifications: mockDb.notifications,
        paymentMethods: mockDb.paymentMethods,
        adminSections: mockDb.adminSections,
        dataExtractionJobs: mockDb.dataExtractionJobs,
        exampleQueries: mockDb.exampleQueries,
        customerSegments: mockDb.customerSegments,
        customerPersonas: mockDb.customerPersonas,
      };

      const singleDocsToMigrate = {
        analytics: { id: 'customerAnalytics', data: mockDb.customerAnalytics },
        admin: { id: 'dashboardMetrics', data: mockDb.dashboardMetrics },
      };

      const summary = [];

      for (const [name, data] of Object.entries(collectionsToMigrate)) {
        await uploadCollection(name, data);
        summary.push({ name, documents: data.length });
        console.log(`Successfully migrated collection: ${name}`);
      }
      
      for (const [collection, doc] of Object.entries(singleDocsToMigrate)) {
         await uploadSingleDocument(collection, doc.id, doc.data);
         summary.push({ name: `${collection}/${doc.id}`, documents: 1 });
         console.log(`Successfully migrated document: ${collection}/${doc.id}`);
      }

      console.log("Database migration completed successfully!");
      return {
        success: true,
        message: "¡La base de datos se pobló con datos de prueba exitosamente!",
        collections: summary,
      };
    } catch (error: any) {
      console.error("Error during database migration flow:", error);
      // Check for specific error related to service account key
      if (error.code === 'MODULE_NOT_FOUND' || error.message.includes('serviceAccountKey.json')) {
          return {
              success: false,
              message: "Error de Migración: No se encontró el archivo 'serviceAccountKey.json'. Asegúrate de que el archivo existe en la raíz de tu proyecto y vuelve a intentarlo.",
              collections: [],
          };
      }
      return {
        success: false,
        message: `Error durante la migración: ${error.message}`,
        collections: [],
      };
    }
  }
);

// Exported wrapper function
export async function migrateDatabase(): Promise<MigrateDatabaseOutput> {
  return migrateDatabaseFlow();
}
