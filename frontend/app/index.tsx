import React, {useEffect} from 'react';
import SplashScreen from "@/screens/Splash/SplashScreen";
import {FIREBASE_APP} from "@/config/config";
import "firebase/firestore";


const App = () => {
    useEffect(() => {
        const app = FIREBASE_APP;
    }, []); // Isso garante que o código seja executado apenas uma vez, quando o componente for montado

    return (
        <SplashScreen>
        </SplashScreen>
    );
};

export default App;


