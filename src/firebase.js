import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with long-polling fallback to fix "client is offline" issues
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

const analytics = getAnalytics(app);
