import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import React, {useEffect, useState} from 'react';
import { FIREBASE_AUTH } from "../configuracao/config"; // Importe o Firebase Auth
import { MaterialIcons } from '@expo/vector-icons';
import {router} from "expo-router";

export default function Layout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        // Verifica se o usuário está logado
        const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(user => {
            setIsAuthenticated(!!user); // Atualiza o estado com base no login
        });

        return () => unsubscribe(); // Remove o listener quando o componente desmonta
    }, []);
    const handleLoginLogout = () => {
        if (isAuthenticated) {
            FIREBASE_AUTH.signOut(); // Faz o logout
            setIsAuthenticated(false); // Atualiza o estado após o logout
        } else {
            router.navigate('/login'); // Navega para a tela de login
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: '#88c9bf', // Light blue background
                        width: 240,
                    },
                    drawerActiveTintColor: '#0288D1', // Darker blue for active item
                    drawerInactiveTintColor: '#333',
                    drawerLabelStyle: {
                        fontSize: 16,
                        fontFamily: 'Roboto_700Bold',
                    },
                    headerStyle: {
                        backgroundColor: '#88c9bf', // Light blue header
                    },
                    headerTintColor: '#000', // Black text color for better contrast
                    headerTitleStyle: {
                        fontFamily: 'Roboto_700Bold',
                    },
                }}
            >
                <Drawer.Screen
                    name="home"
                    options={{
                        drawerLabel: 'Home',
                        title: 'Home',
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="home" color={color} size={size} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="cadastrar-animal"
                    options={{
                        drawerLabel: 'Cadastro de Animal',
                        title: 'Cadastro de Animal',
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="pets" color={color} size={size} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="login"
                    options={{
                        drawerLabel: isAuthenticated ? 'Logout' : 'Login', // Muda o rótulo do botão
                        title: isAuthenticated ? 'Logout' : 'Login',
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name={isAuthenticated ? 'logout' : 'login'} color={color} size={size} />
                        ),
                        // Adiciona a lógica de login/logout
                        onPress: handleLoginLogout,
                    }}
                />
                <Drawer.Screen
                    name="cadastro-pessoa"
                    options={{
                        drawerLabel: 'Cadastro de Usuário',
                        title: 'Cadastro de Usuário',
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="person-add" color={color} size={size} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="adotar"
                    options={{
                        drawerLabel: 'Adotar Pet',
                        title: 'Adotar Pet',
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="favorite" color={color} size={size} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="profile-animal"
                    options={{
                        drawerLabel: 'Perfil Animal',
                        title: 'Perfil Animal',
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="pets" color={color} size={size} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="usuario-nao-cadastrado"
                    options={{
                        drawerLabel: 'Register',
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="person" color={color} size={size} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="index"
                    options={{
                        drawerLabel: 'Início',
                        title: 'Início',
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="home" color={color} size={size} />
                        ),
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
