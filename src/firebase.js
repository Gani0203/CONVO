import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtnIuyPHlSKqlIvcSSRnNfXbkNQxw4Gaw",
  authDomain: "convo-74286.firebaseapp.com",
  projectId: "convo-74286",
  storageBucket: "convo-74286.firebasestorage.app",
  messagingSenderId: "192765261480",
  appId: "1:192765261480:web:5e85947f0c28c215f3749d",
  measurementId: "G-NBE2V18CS3",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
