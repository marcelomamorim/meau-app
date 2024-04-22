
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "@firebase/auth";
import { FIREBASE_APP } from "@/config/config";

const TelaDeAutenticacao = () => {
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
      await signInWithEmailAndPassword(auth, nomeUsuario, senha);
      setSnackbarMessage('Usuário logado com sucesso!');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage('Login ou senha incorretos');
      setSnackbarVisible(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSnackbarMessage('Usuário deslogado com sucesso!');
      setSnackbarVisible(true);
    } catch (error) {
      // @ts-ignore
        console.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={styles.containerFormulario}>
            <TextInput
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
            <Button mode="contained" onPress={handleLogin} style={styles.botaoEntrar} aria-label="Botão de entrar">
              ENTRAR
            </Button>
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
  },
  containerBotoes: {
    marginHorizontal: '10%',
    marginTop: '5%',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  botaoEntrar: {
    marginBottom: 15,
    backgroundColor: '#88c9bf',
  },
  botao: {
    marginBottom: 15,
    paddingVertical: 5,
  },
  botaoEntrarFacebook: {
    backgroundColor: '#3b5998',
    marginTop: 50
  },
  botaoEntrarGoogle: {
    backgroundColor: '#db4437',
  },
  buttonLabel: {
    color: '#fff',
  },
});

export default TelaDeAutenticacao;
