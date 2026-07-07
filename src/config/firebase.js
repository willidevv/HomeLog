import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDBO-Ub2VcC9lX_TSgwEqlGYCRksOfbFuE",
    authDomain: "homelog-6ef4f.firebaseapp.com",
    projectId: "homelog-6ef4f",
    storageBucket: "homelog-6ef4f.firebasestorage.app",
    messagingSenderId: "522271513806",
    appId: "1:522271513806:web:0d36457caf6af1e207049f",
    measurementId: "G-8Y8X1S2VY7"
};


const app = initializeApp(firebaseConfig);

// PASTIKAN SEMUA VARIABEL INI DIEKSPOR DENGAN BENAR:
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = firebaseConfig.appId; // <-- TAMBAHKAN BARIS INI