import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import { TextInput, Button, useTheme, Snackbar } from 'react-native-paper';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, db } from '@/configuracao/config'; // Usando suas variáveis já configuradas
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { doc, updateDoc } from 'firebase/firestore';

const TelaDeAutenticacao = () => {
  const { colors } = useTheme();
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Função para registrar o token de notificações
  async function registerForPushNotificationsAsync(userId: string) {
    let token;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Você precisa habilitar notificações!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    // Atualizar Firestore com o token do usuário
    if (userId) {
      const userRef = doc(db, 'usuarios', userId);
      await updateDoc(userRef, {
        notificationToken: token,
      });
    }

    return token;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, nomeUsuario, senha).then(
          async (userCredential) => {
            setSnackbarMessage('Usuário logado com sucesso!');
            setSnackbarVisible(true);

            const userId = userCredential.user?.uid; // Garantir que o userId é obtido após login

            if (userId) {
              // Registrar o token de notificações do Expo para este usuário
              await registerForPushNotificationsAsync(userId);
            }

            router.navigate('home');
          },
          (error) => {
            setSnackbarMessage('Ocorreu falha no login. Por favor, tente novamente.');
            setSnackbarVisible(true);
          }
      );
    } catch (error) {
      setSnackbarMessage('Login ou senha incorretos');
      setSnackbarVisible(true);
    }
  };

  const handleSocialLogin = (social: string) => {
    console.log(`Log in with ${social}`);
    // Integrate with Firebase social authentication accordingly
  };

  return (
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.containerFormulario}>
            <TextInput
                autoCapitalize="none"
                label="Nome de usuário"
                value={nomeUsuario}
                onChangeText={setNomeUsuario}
                mode="flat"
                style={styles.input}
                underlineColor="transparent"
                inputMode="text"
                theme={{ colors: { primary: '#000', background: '#F5F5F5' } }}
                aria-label="Campo de entrada de email"
            />
            <TextInput
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                mode="flat"
                underlineColor="transparent"
                style={styles.input}
                inputMode="text"
                theme={{ colors: { primary: '#000', background: '#F5F5F5' } }}
                aria-label="Campo de entrada de senha"
            />
          </View>
          <View style={styles.containerBotoes}>
            <Button mode="contained" onPress={handleLogin} style={[styles.botao, styles.botaoEntrar]}>
              ENTRAR
            </Button>
            <TouchableOpacity
                onPress={() => handleSocialLogin('Facebook')}
                style={[styles.botao, styles.botaoEntrarFacebook]}
            >
              <FontAwesome name="facebook" size={20} color={colors.surface} style={styles.iconLeft} />
              <Text style={styles.buttonLabel}>ENTRAR COM FACEBOOK</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleSocialLogin('Google')}
                style={[styles.botao, styles.botaoEntrarGoogle]}
            >
              <FontAwesome name="google" size={20} color={colors.surface} style={styles.iconLeft} />
              <Text style={styles.buttonLabel}>ENTRAR COM GOOGLE</Text>
            </TouchableOpacity>
          </View>
          <Snackbar
              visible={snackbarVisible}
              onDismiss={() => setSnackbarVisible(false)}
              duration={3000}
              style={{
                backgroundColor: snackbarMessage === 'Usuário logado com sucesso!' ? 'green' : 'red',
              }}
          >
            {snackbarMessage}
          </Snackbar>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  containerFormulario: {
    marginHorizontal: '10%',
    marginTop: '25%',
  },
  containerBotoes: {
    marginHorizontal: '10%',
    marginTop: '5%',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 3,
    marginTop: 10,
  },
  botaoEntrar: {
    backgroundColor: '#88c9bf',
    fontWeight: 'bold',
  },
  botaoEntrarFacebook: {
    backgroundColor: '#3b5998',
    marginTop: '20%',
  },
  botaoEntrarGoogle: {
    backgroundColor: '#DB4437',
  },
  buttonLabel: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  iconLeft: {
    marginRight: 10,
  },
});

export default TelaDeAutenticacao;
