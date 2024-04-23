import React, { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from "@/config/config";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";

// @ts-ignore
const AuthorizationLayerWrapper = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(user => {
            setIsAuthenticated(!!user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            console.log("User is not authenticated, access denied.");
            router.navigate('usuario-nao-cadastrado');
        }
    }, [loading, isAuthenticated]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return null;
};

export default AuthorizationLayerWrapper;
