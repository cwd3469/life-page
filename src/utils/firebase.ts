import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const FirebaseConfig = () => {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_messagingSenderId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_appId,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_measurementId,
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  return db;
};

export default FirebaseConfig;
