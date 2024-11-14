// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const FirebaseConfig = {
  apiKey: "AIzaSyCUb2ISJixkXdMqsPol6QijR97ZYz8muIs",
  authDomain: "agencia-viajes-14ea7.firebaseapp.com",
  projectId: "agencia-viajes-14ea7",
  storageBucket: "agencia-viajes-14ea7.firebasestorage.app",
  messagingSenderId: "779238025204",
  appId: "1:779238025204:web:04b7e612e7db08e1713ba1"
};

// Initialize Firebase
const app = initializeApp(FirebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export default db;
