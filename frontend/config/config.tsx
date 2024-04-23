import "firebase/firestore";
import {initializeApp} from "@firebase/app";
import {getReactNativePersistence, initializeAuth} from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore} from "@firebase/firestore";
import Constants from 'expo-constants';

const config = Constants.expoConfig?.extra;

const firebaseConfig = {
    apiKey: config?.apiKey,
    authDomain: config?.authDomain,
    projectId: config?.projectId,
    storageBucket: config?.storageBucket,
    messagingSenderId: config?.messagingSenderId,
    appId: config?.appId
};

export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(FIREBASE_APP);