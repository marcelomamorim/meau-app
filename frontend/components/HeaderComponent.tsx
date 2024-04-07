import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import {router} from "expo-router";

// @ts-ignore
const HeaderComponent = ({ title, leftSideButton }) => {// If using React Navigation

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.navigate(leftSideButton)} style={styles.backButton}>
                <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.placeholder} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 20, // Adjust for status bar height
        paddingBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#f8f8f8', // Customize your header background color
    },
    backButton: {
        padding: 10, // Makes it easier to tap
    },
    backButtonText: {
        fontSize: 16, // Customize as needed
        color: '#007bff', // Customize your back button text color
    },
    title: {
        flex: 1, // Takes up the maximum available space
        textAlign: 'center', // Ensures the text is centered
        fontSize: 18, // Customize as needed
        fontWeight: 'bold',
    },
    placeholder: {
        width: 10, // Maintains the flex layout, adjust as needed
    },
});

export default HeaderComponent;