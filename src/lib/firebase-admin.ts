import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

let db: admin.firestore.Firestore;
let isAdminSdkInitialized = false;

if (getApps().length === 0) {
  try {
    const serviceAccount = require('../../serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isAdminSdkInitialized = true;
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.warn(
        'Firebase Admin SDK initialization skipped: serviceAccountKey.json not found. ' +
        'This is normal for client-side rendering but may cause errors in server-side logic. ' +
        'Ensure the file is present in your deployment environment.'
      );
    } else {
      console.error("Firebase Admin SDK initialization failed:", error);
    }
  }
} else {
    isAdminSdkInitialized = true;
}

// Only assign db if the app was initialized
if (admin.apps.length > 0 && admin.apps[0]) {
    db = admin.firestore();
} else {
    // If initialization failed or we're in an environment without the SDK,
    // db will be a mock object that will prevent the app from crashing during development.
    db = new Proxy({}, {
        get(target, prop) {
            if (prop === 'then') return undefined; // Prevent object from being treated as a promise
            
            // Return a function that returns a mock object for chained calls like db.collection().doc().get()
            return () => ({
                get: () => Promise.resolve({
                    exists: false,
                    data: () => undefined,
                    docs: [],
                    empty: true,
                    size: 0
                }),
                doc: () => ({
                    get: () => Promise.resolve({
                        exists: false,
                        data: () => undefined,
                    }),
                    set: () => Promise.resolve(),
                }),
                 where: () => ({
                    get: () => Promise.resolve({ docs: [], empty: true, size: 0 }),
                }),
                collection: () => ({
                    get: () => Promise.resolve({ docs: [], empty: true, size: 0 }),
                }),
            });
        }
    }) as admin.firestore.Firestore;
}

export { db, isAdminSdkInitialized };
