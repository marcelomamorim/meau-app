import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {router} from "expo-router";
import * as Font from 'expo-font';

const OnboardingScreen = () => {

    const handleRegister = () => {
        router.navigate('register');
    };

    const handleLogin = () => {
        router.navigate('login')
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ops!</Text>
            <Text style={styles.message}>Você não pode realizar esta ação sem possuir um cadastro.</Text>

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
        marginBottom: '30%',
        fontFamily: 'Courgette-Regular'
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 30,
        marginLeft: '10%',
        marginRight: '10%',
        color: '#757575',
        fontFamily: 'Roboto'
    },
    question: {
        fontSize: 14,
        color: '#757575',
        marginVertical: 20,
        fontFamily: 'Roboto'
    },
    button: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 10,
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
        fontSize: 14,
        color: '#434343',
        fontFamily: 'Roboto'
    },
});

export default OnboardingScreen;
