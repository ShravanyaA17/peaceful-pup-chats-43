import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9wn1_su8v3h10dKlymxlljwvXTbyOYVQ",
  authDomain: "peace-b3577.firebaseapp.com",
  projectId: "peace-b3577",
  storageBucket: "peace-b3577.firebasestorage.app",
  messagingSenderId: "1052504121790",
  appId: "1:1052504121790:web:4d4ce44ca5a957544e99ef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
