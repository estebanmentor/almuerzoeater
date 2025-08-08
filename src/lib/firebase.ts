
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "almuerzocl-oka16",
  "appId": "1:189976486048:web:61ca1b6d0949f3836829c5",
  "storageBucket": "almuerzocl-oka16.firebasestorage.app",
  "apiKey": "AIzaSyDjMDwbUYk1aDaZkGAYKR-2pvcdaP2l9V0",
  "authDomain": "almuerzocl-oka16.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "189976486048"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, analytics };
