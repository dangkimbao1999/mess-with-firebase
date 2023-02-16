// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeApp as adminInitialize } from 'firebase-admin/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCT6OX4qA34Rg5NnctGk_KcBVYBM2y5YqY",
  authDomain: "deeptech-test-ee3e1.firebaseapp.com",
  projectId: "deeptech-test-ee3e1",
  storageBucket: "deeptech-test-ee3e1.appspot.com",
  messagingSenderId: "696187018565",
  appId: "1:696187018565:web:0b1435d9ec257f5abcb22c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const app1 = adminInitialize();
export const db = getFirestore();
