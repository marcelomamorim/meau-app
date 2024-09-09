import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';
import { FIREBASE_AUTH } from '@/configuracao/config';

const WelcomeScreen = () => {
    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    const handleAdopt = () => {
        router.navigate('/adotar');
        console.log('Adopt button pressed');
    };

    const handleHelp = () => {
        router.navigate('/ajudar');
        console.log('Help button pressed');
    };

    const handleRegisterAnimal = () => {
        router.navigate('/cadastrar-animal');
        console.log('Register Animal button pressed');
    };

    const redirectToLogin = () => {
        if (isAuthenticated) {
            FIREBASE_AUTH.signOut();
            setIsAuthenticated(false);
        } else {
            router.navigate('/login');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Animal Image */}
                <Image
                    source={{
                        uri: 'https://files.oaiusercontent.com/file-ZNqn9p6KgwGMHNGMB7rscRB0?se=2024-09-08T04%3A01%3A29Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dbf4650d0-69c1-4c93-aca7-590374224bd1.webp&sig=sU8MqTizGMUBVa0dTFdF%2BUpYIzPF/ZlvtgLhRBw/SEw%3D',
                    }}
                    style={styles.image}
                />
                {/* Welcome Text */}
                <Text style={styles.description}>
                    Bem vindo ao Meau! Aqui você pode adotar, doar e ajudar cães e gatos com facilidade. Qual o seu interesse?
                </Text>

                <TouchableOpacity style={styles.button} onPress={handleAdopt}>
                    <Text style={styles.buttonText}>adotar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleRegisterAnimal}>
                    <Text style={styles.buttonText}>cadastrar animal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={redirectToLogin}>
                    <Text style={styles.loginText}>{isAuthenticated ? 'logout' : 'login'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#F0F0F0',
    },
    content: {
        alignItems: 'center',
        marginTop: 50,
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 125,
        marginBottom: 30,
        resizeMode: 'cover',
    },
    description: {
        fontSize: 18,
        fontFamily: 'Roboto_400Regular',
        color: '#333',
        textAlign: 'center',
        marginHorizontal: 30,
        marginBottom: 50,
    },
    button: {
        backgroundColor: '#E0C261',
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginVertical: 20,
        borderRadius: 25,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        textAlign: 'center',
        fontFamily: 'Roboto_700Bold',
        color: '#fff',
        fontSize: 18,
    },
    loginButton: {
        marginTop: 40,
        backgroundColor: '#4CAF50', // Soft green for login
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
        width: '60%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    loginText: {
        fontSize: 18,
        fontFamily: 'Roboto_700Bold',
        color: '#fff',
        textAlign: 'center',
        textDecorationLine: 'none',
    },
    logoutButton: {
        marginTop: 15,
        backgroundColor: 'lightgray', // Dark gray for logout
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
        width: '60%',
        shadowColor: '#222',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    logoutText: {
        fontSize: 18,
        fontFamily: 'Roboto_700Bold',
        color: '#ffffff',
        textAlign: 'center',
    },
});

export default WelcomeScreen;
