import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import React from 'react';

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer>
                <Drawer.Screen
                    name="home"
                    options={{
                        drawerLabel : 'Home',
                        title: 'Home'
                    }}
                />
                <Drawer.Screen
                    name="cadastrar-animal"
                    options={{
                        drawerLabel: 'Cadastro de Animal',
                        title: 'Cadastro de Animal',
                    }}
                />
                <Drawer.Screen
                    name="login"
                    options={{
                        drawerLabel: 'Login',
                        title: 'Login',
                    }}
                />
                <Drawer.Screen
                    name="cadastro-pessoa"
                    options={{
                        drawerLabel: 'Cadastro de Usuário',
                        title: 'Cadastro de Usuário',
                    }}
                />
                <Drawer.Screen
                    name="usuario-nao-cadastrado"
                    options={{
                        drawerLabel : '',

                    }}
                />
                <Drawer.Screen
                    name="index"
                    options={{
                        drawerLabel: '',
                        title: '',
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
