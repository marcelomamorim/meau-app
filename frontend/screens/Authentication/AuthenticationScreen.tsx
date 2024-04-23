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
import {TextInput, Button, useTheme, Snackbar} from 'react-native-paper';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "@firebase/auth";
import { FIREBASE_APP } from "@/config/config";
import { FontAwesome } from '@expo/vector-icons';
import {router} from "expo-router";

const TelaDeAutenticacao = () => {
  const { colors } = useTheme();
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const auth = getAuth(FIREBASE_APP);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        // @ts-ignore
        return setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, nomeUsuario, senha).then(
          () => {
            setSnackbarMessage('Usuário logado com sucesso!');
            setSnackbarVisible(true);
            router.navigate('home')
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
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
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
                theme={{ colors: { primary: '#000', background: '#F5F5F5' }}}
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
                theme={{ colors: { primary: '#000', background: '#F5F5F5' }}}
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
            {/* ... Snackbar */}
          </View>
          <Snackbar
              visible={snackbarVisible}
              onDismiss={() => setSnackbarVisible(false)}
              duration={3000}
              style={{ backgroundColor: snackbarMessage === 'Usuário logado com sucesso!' ? 'green' : 'red' }}
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
    marginTop: '25%'
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
    backgroundColor: '#95bb9f',
    fontWeight: "bold"
  },
  botaoEntrarFacebook: {
    backgroundColor: '#3b5998',
    marginTop: '20%'
  },
  botaoEntrarGoogle: {
    backgroundColor: '#DB4437',
  },
  buttonLabel: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 10,
    fontWeight: "bold"
  },
  iconLeft: {
    marginRight: 10,
  }
});

export default TelaDeAutenticacao;
