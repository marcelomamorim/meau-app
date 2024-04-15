import React, {useEffect} from 'react';
import SplashScreen from "@/screens/Splash/SplashScreen";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAPhe4QT0dqB9LPtmyZ6eLivJP_BuZ3Q4s",
    authDomain: "miauapp-3001d.firebaseapp.com",
    projectId: "miauapp-3001d",
    storageBucket: "miauapp-3001d.appspot.com",
    messagingSenderId: "984809883894",
    appId: "1:984809883894:web:f4ee0d1c9c6331aa3584d7",
    measurementId: "G-QV3M8DEXJM"
};

const App = () => {
    useEffect(() => {
        const app = initializeApp(firebaseConfig);
    }, []); // Isso garante que o código seja executado apenas uma vez, quando o componente for montado

    return (
        <SplashScreen>
        </SplashScreen>
    );
};

export default App;


