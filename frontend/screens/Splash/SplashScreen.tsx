import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import { router } from 'expo-router';
import * as Font from "expo-font";

const SplashScreen = () => {

    useEffect(() => {

        const loadFonts = async () => {
            await Font.loadAsync({
                'Courgette-Regular': require('../../assets/fonts/Courgette-Regular.ttf'),
                'Roboto': require('../../assets/fonts/Roboto-Medium.ttf'),
            });
        };

        loadFonts().then( () => console.log('Fontes carregadas'));
        setTimeout(() => router.navigate('/onboard'), 2000);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/meau-logo.png')}
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
