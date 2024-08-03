import React, {useEffect} from 'react';
import SplashScreen from "@/screens/Splash/SplashScreen";
import {FIREBASE_APP} from "@/config/config";
import "firebase/firestore";


const App = () => {

    useEffect(() => {
        const app = FIREBASE_APP;
    }, []);

    return (
        <SplashScreen>
        </SplashScreen>
    );

};

export default App;


