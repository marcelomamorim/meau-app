import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {router} from "expo-router";

const OnboardingScreen = () => {
    const handleRegister = () => {
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

            <Text style={styles.question}>Já possui Cadastro?</Text>

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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
        color: '#666',
    },
    question: {
        fontSize: 16,
        color: '#777',
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
        backgroundColor: '#4CAF50', // Green
    },
    loginButton: {
        backgroundColor: '#2196F3', // Blue
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;
