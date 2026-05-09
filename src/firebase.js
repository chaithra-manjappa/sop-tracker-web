import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCwboOpUAXYqewcui5HEAl5tIPCdUnObXQ",
  authDomain: "sop-tracker-b4ba7.firebaseapp.com",
  projectId: "sop-tracker-b4ba7",
  storageBucket: "sop-tracker-b4ba7.firebasestorage.app",
  messagingSenderId: "356183425053",
  appId: "1:356183425053:web:9400da2d4ed1208c6b86f4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);