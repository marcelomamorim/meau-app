import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {router} from "expo-router";

const OnboardingScreen = () => {
    const handleRegister = () => {
        router.navigate('register');
        console.log('Navigating to Registration Screen...');
    };

    const handleLogin = () => {
        router.navigate('login')
        console.log('Navigating to Login Screen...');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ops!</Text>
            <Text style={styles.message}>Você não pode realizar esta ação sem cadastrar.</Text>

            <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
                <Text style={styles.buttonText}>Fazer Cadastro</Text>
            </TouchableOpacity>

            <Text style={styles.question}>Já possui cadastro?</Text>

            <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
                <Text style={styles.buttonText}>Fazer Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 53,
        fontWeight: 'bold',
        color: '#88c9bf',
        marginBottom: '30%'
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        color: '#757575',
    },
    question: {
        fontSize: 14,
        color: '#757575',
        marginVertical: 20,
    },
    button: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 30,
        marginBottom: 10,
        minWidth: 200,
        alignItems: 'center',
    },
    registerButton: {
        backgroundColor: '#88c9bf',
        width: '85%'
    },
    loginButton: {
        backgroundColor: '#88c9bf',
        width: '85%'
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;
