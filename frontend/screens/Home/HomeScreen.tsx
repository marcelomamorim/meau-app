// @ts-ignore
import React from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WelcomeScreen = () => {
    const handleAdopt = () => {
        router.navigate('/adotar')
        console.log('Adopt button pressed');
    };

    const handleHelp = () => {
        router.navigate('/ajudar')
        console.log('Help button pressed');
    };

    const handleRegisterAnimal = () => {
        router.navigate('/cadastrar-animal')
        console.log('UserRegister Animal button pressed');
    };

    const redirectToLogin = () => {
        router.navigate('/login')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Olá!</Text>
            <Text style={styles.description}>
                Bem vindo ao Meau! Aqui você pode adotar, doar e ajudar cães e gatos com facilidade. Qual o seu interesse?
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleAdopt}>
                <Text style={styles.buttonText}>ADOTAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleHelp}>
                <Text style={styles.buttonText}>AJUDAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleRegisterAnimal}>
                <Text style={styles.buttonText}>CADASTRAR ANIMAL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={redirectToLogin}>
                <Text style={styles.loginText}>login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    menuButton: {
    },
    heading: {
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    description: {
        textAlign: 'center',
        marginHorizontal: 30,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#FFD700',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 10,
        borderRadius: 5,
        width: '80%',
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    loginButton: {
        marginTop: 20
    },
    loginText: {
      fontSize: 16,
      fontWeight: "bold"
    },
    footer: {
        position: 'absolute',
        bottom: 10,
    },
});

export default WelcomeScreen;
