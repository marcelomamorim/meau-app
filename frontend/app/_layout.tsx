import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export default function Layout() {
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
                        drawerLabel: 'Login',
                        title: 'Login',
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="login" color={color} size={size} />
                        ),
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
