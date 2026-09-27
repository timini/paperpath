import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase web config is public by design; access is controlled by Auth and security rules.
const config = {
  apiKey: "AIzaSyDCV7gR6CCBeeH_6Wywh2eR_At-y0fRqq8",
  authDomain: "paperpath-learn.firebaseapp.com",
  projectId: "paperpath-learn",
  storageBucket: "paperpath-learn.firebasestorage.app",
  messagingSenderId: "166134195111",
  appId: "1:166134195111:web:ebe1c1a543f13f0e648c82",
};

export const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
