import React, { useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';

const WelcomeScreen = () => {

    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
    });

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
        router.navigate('/login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.heading}>Olá!</Text>
                <Text style={styles.description}>
                    Bem vindo ao Meau! Aqui você pode adotar, doar e ajudar cães e gatos com facilidade. Qual o seu interesse?
                </Text>

                <TouchableOpacity style={styles.button} onPress={handleAdopt}>
                    <Text style={styles.buttonText}>adotar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleRegisterAnimal}>
                    <Text style={styles.buttonText}>cadastrar animal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginButton} onPress={redirectToLogin}>
                    <Text style={styles.loginText}>login</Text>
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
        backgroundColor: '#FFFFFF',
    },
    content: {
        alignItems: 'center',
        marginTop: 50,
    },
    heading: {
        fontSize: 36,
        fontFamily: 'Roboto_700Bold',
        color: '#000',
        marginVertical: 20,
    },
    description: {
        fontSize: 18,
        fontFamily: 'Roboto_400Regular',
        color: '#000',
        textAlign: 'center',
        marginHorizontal: 30,
        marginBottom: 50,
    },
    button: {
        backgroundColor: '#FFD700',
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
    },
    loginText: {
        fontSize: 18,
        fontFamily: 'Roboto_700Bold',
        color: '#000',
        textDecorationLine: 'underline',
    },
});

export default WelcomeScreen;
