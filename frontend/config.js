const fs = require('fs');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Definir a configuração do Expo
const config = {
    expo: {
        name: 'meau-app',
        slug: 'miau-app',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        scheme: 'myapp',
        userInterfaceStyle: 'automatic',
        jsEngine: 'hermes',
        android: {
            package: 'com.igorbastos.meauapp',
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-icon.png',
                backgroundColor: '#ffffff'
            }
        },
        splash: {
            image: './assets/images/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff'
        },
        assetBundlePatterns: [
            '**/*'
        ],
        ios: {
            supportsTablet: true
        },
        web: {
            bundler: 'metro',
            output: 'static'
        },
        plugins: [
            'expo-router',
            'expo-font'
        ],
        experiments: {},
        extra: {
            apiKey: process.env.API_KEY,
            authDomain: process.env.AUTH_DOMAIN,
            projectId: process.env.PROJECT_ID,
            storageBucket: process.env.STORAGE_BUCKET,
            messagingSenderId: process.env.MESSAGING_SENDER_ID,
            appId: process.env.APP_ID,
            router: {
                origin: false
            },
            eas: {
                projectId: '84085e6e-5d24-4c65-9424-c16f10f39f66'
            }
        }
    }
};

// Salvar a configuração em um arquivo app.config.json
fs.writeFileSync('app.config.json', JSON.stringify(config, null, 2));
