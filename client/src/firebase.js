// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    //secure ur key in .env
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernestate-244b9.firebaseapp.com",
  projectId: "mernestate-244b9",
  storageBucket: "mernestate-244b9.appspot.com",
  messagingSenderId: "191455759739",
  appId: "1:191455759739:web:f3560e4cf5432645c101de"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);