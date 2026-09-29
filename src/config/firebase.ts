// Firebase Configuration for "Cùng Ôn Luyện"
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nckh9a3.firebaseapp.com",
  projectId: "nckh9a3",
  storageBucket: "nckh9a3.firebasestorage.app",
  messagingSenderId: "210424539361",
  appId: "1:210424539361:web:c5d5117d636c96a138efa0",
  measurementId: "G-HQHZ9Y64PB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
