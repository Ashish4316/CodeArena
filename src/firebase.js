import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
    initializeFirestore,
    getFirestore,
    CACHE_SIZE_UNLIMITED
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCPZuK_bCztyv5GsEXuxNNNYMX2R-WGPNQ",
    authDomain: "codearena-f3f67.firebaseapp.com",
    projectId: "codearena-f3f67",
    storageBucket: "codearena-f3f67.firebasestorage.app",
    messagingSenderId: "969157619710",
    appId: "1:969157619710:web:de3d57cf2054bafbb59aaf",
    measurementId: "G-3VRNDX9TDB"
};

// Initialize Firebase (check if already initialized for HMR)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore (handle already initialized error during HMR)
let dbInstance;
try {
    dbInstance = initializeFirestore(app, {
        experimentalForceLongPolling: true,
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    });
} catch (e) {
    // If already initialized, just get the existing instance
    dbInstance = getFirestore(app);
}

export const db = dbInstance;
const analytics = getAnalytics(app);
