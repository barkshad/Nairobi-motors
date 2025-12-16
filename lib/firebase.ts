import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF3FnrxPYa6Hj_0lIT59FP9CSCIk7aS0w",
  authDomain: "mati-foundation-2d67e.firebaseapp.com",
  projectId: "mati-foundation-2d67e",
  storageBucket: "mati-foundation-2d67e.firebasestorage.app",
  messagingSenderId: "769000463528",
  appId: "1:769000463528:web:a67cbe264e7b9e4d71369d",
  measurementId: "G-69NRSQM60F"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);