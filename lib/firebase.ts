import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBPmKDKzipmqA6jcpu9fkZml0qXB2C5G8E",
  authDomain: "daewazone.firebaseapp.com",
  projectId: "daewazone",
  storageBucket: "daewazone.firebasestorage.app",
  messagingSenderId: "279918947809",
  appId: "1:279918947809:web:7d2a2470983c391e19f6a0",
  measurementId: "G-WTSBFC6Y4W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };
