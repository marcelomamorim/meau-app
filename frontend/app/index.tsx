import React, { useEffect } from 'react';
import SplashScreen from "../screens/Splash/SplashScreen";
import { FIREBASE_APP } from "../configuracao/config";
import * as Notifications from 'expo-notifications'; // Importando notificações
import { Platform } from 'react-native'; // Importar para verificar a plataforma
import "firebase/firestore";

// Função para solicitar permissões de notificações
async function requestPermissions() {
    // Obtenha as permissões atuais
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Se as permissões não forem concedidas, solicite-as
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    // Se as permissões ainda não estiverem concedidas, exiba um alerta
    if (finalStatus !== 'granted') {
        alert('As notificações estão desativadas. Por favor, ative nas configurações.');
    }
}

// Função para configurar o canal de notificações no Android
async function configureNotificationChannel() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            sound: true, // Ativar som
            vibrationPattern: [0, 250, 250, 250], // Padrão de vibração
            lightColor: '#FF231F4C', // Cor da luz de notificação
        });
    }
}

const App = () => {
    useEffect(() => {
        const app = FIREBASE_APP;
        // Solicitar permissões de notificação ao iniciar o app
        requestPermissions();
        // Configurar canal de notificações no Android
        configureNotificationChannel();
    }, []);

    return (
        <SplashScreen />
    );
};

export default App;
