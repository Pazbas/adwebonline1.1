// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBw4tRl0rcm7pZpaE98YLAFyDjF5Pub86Q",
  authDomain: "cursos-7458a.firebaseapp.com",
  projectId: "cursos-7458a",
  storageBucket: "cursos-7458a.firebasestorage.app",
  messagingSenderId: "149206676833",
  appId: "1:149206676833:web:a66e1ceb6527bc936a4120"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
