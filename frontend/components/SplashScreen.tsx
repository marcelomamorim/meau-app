import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import { router } from 'expo-router';
import * as Font from "expo-font";

// @ts-ignore
const SplashScreen = () => {

    useEffect(() => {

        const loadFonts = async () => {
            await Font.loadAsync({
                'Courgette-Regular': require('../assets/fonts/Courgette-Regular.ttf'),
                'Roboto': require('../assets/fonts/Roboto-Medium.ttf'),
            });
        };

        loadFonts().then(r => console.log('Fontes carregadas'));
        setTimeout(() => router.navigate('/onboard'), 2000);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/meau-logo.png')}
                style={styles.image}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default SplashScreen;
