import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';

// @ts-ignore
const SplashScreen = () => {
    useEffect(() => {
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
