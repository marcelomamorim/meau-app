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
        // If you're using a container for additional styling
        padding: 10, // This increases the visible area if the container is part of the button design
    },
    touchable: {
        // Minimum touchable size. Adjust accordingly if you have a specific size in mind.
        padding: 10, // Increases the touchable area visually
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 24, // Adjust based on your icon's size
        height: 24, // Adjust based on your icon's size
    },
});

export default BackButton;