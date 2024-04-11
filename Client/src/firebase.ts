// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-b7812.firebaseapp.com",
  projectId: "real-estate-b7812",
  storageBucket: "real-estate-b7812.appspot.com",
  messagingSenderId: "615757389835",
  appId: "1:615757389835:web:031cac0a8149515781e70e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);