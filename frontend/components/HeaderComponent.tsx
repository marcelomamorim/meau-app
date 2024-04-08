import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {router} from "expo-router";
import BackButtonComponent from "@/components/BackButtonComponent";

// @ts-expect-error: resolving types
const HeaderComponent = ({ title, leftSideButton }) => {

    return (
        <View style={styles.container}>
            <BackButtonComponent onPress={() => {
                router.navigate(leftSideButton);
            }}></BackButtonComponent>
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
        paddingTop: 10,
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
        fontSize: 24,
        marginLeft: '-35%',
        fontFamily: 'Roboto',
        color: '#434343'
    },
    placeholder: {
        width: 15,
    },
    backIcon: {
        width: 15,
        height: 15,
    },
});

export default HeaderComponent;