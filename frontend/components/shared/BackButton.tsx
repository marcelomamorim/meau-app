import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';

// @ts-ignore
const BackButton = ({ onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress} style={styles.touchable} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                <Image
                    source={{ uri: 'https://icons.iconarchive.com/icons/icons8/ios7/256/Arrows-Back-icon.png' }}
                    style={styles.icon}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    touchable: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
    },
});

export default BackButton;