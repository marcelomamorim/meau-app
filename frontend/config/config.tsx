import "firebase/firestore";
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCT81l4DgQ9aLZaqI1gkeNcWMLydbgfGVU",
    authDomain: "meau-app-fda38.firebaseapp.com",
    projectId: "meau-app-fda38",
    storageBucket: "meau-app-fda38.appspot.com",
    messagingSenderId: "655805003245",
    appId: "1:655805003245:web:a6310ea2638c1cf8a4a3e4",
    measurementId: "G-BBR53BFX4P"
  };

export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

export const db = getFirestore(FIREBASE_APP);