import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {router} from "expo-router";
import BackButton from "@/components/shared/BackButton";

// @ts-ignore
const HeaderComponent = ({ title, leftSideButton }) => {

    return (
        <View style={styles.container}>
            <BackButton onPress={() => {
                router.navigate(leftSideButton);
            }}></BackButton>
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
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#88c9bf',
        borderRadius: 5
    },
    backButton: {
        padding: 15,
    },
    backButtonText: {
        fontSize: 16,
        color: '#007bff',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: '-15%'
    },
    placeholder: {
        width: 10,
    },
    backIcon: {
        width: 20,
        height: 20,
    },
});

export default HeaderComponent;