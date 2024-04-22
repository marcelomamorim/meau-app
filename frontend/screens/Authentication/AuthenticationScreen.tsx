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
      setUser(user);
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
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  containerFormulario: {
    paddingTop: '30%',
    paddingBottom: '5%',
    marginLeft: '10%',
    marginRight: '10%',
  },
  containerBotoes: {
    paddingBottom: '30%',
    marginLeft: '10%',
    marginRight: '10%',
    color: '#fafafa'
  },
  input: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#d5cece'
  },
  botaoEntrar: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: '25%',
    backgroundColor: '#88c9bf',
    padding: 12
  },
});

export default TelaDeAutenticacao;
