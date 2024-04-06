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
                source={require('../assets/images/meau-logo.png')} // Use require for local images
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
        width: '100%', // Adjust based on your image's aspect ratio
        height: '100%', // Adjust based on your image's aspect ratio
    },
});

export default SplashScreen;
