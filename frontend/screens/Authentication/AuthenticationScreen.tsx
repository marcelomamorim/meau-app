import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, SafeAreaView, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAPhe4QT0dqB9LPtmyZ6eLivJP_BuZ3Q4s",
  authDomain: "miauapp-3001d.firebaseapp.com",
  projectId: "miauapp-3001d",
  storageBucket: "miauapp-3001d.appspot.com",
  messagingSenderId: "984809883894",
  appId: "1:984809883894:web:f4ee0d1c9c6331aa3584d7",
  measurementId: "G-QV3M8DEXJM"
};

const app = initializeApp(firebaseConfig);

const TelaDeAutenticacao: React.FC = () => {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state

  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, nomeUsuario, senha);
      console.log('Usuário logado com sucesso!');
    } catch (error) {
      console.error('Erro de autenticação:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Usuário deslogado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps="handled">
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
              {user ? (
                  <Button mode="contained" onPress={handleLogout} style={styles.botaoSair} aria-label="Botão de sair">
                    SAIR
                  </Button>
              ) : (
                  <Button mode="contained" onPress={handleLogin} style={styles.botaoEntrar} aria-label="Botão de entrar">
                    ENTRAR
                  </Button>
              )}
            </View>
          </ScrollView>
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
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
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
  botaoSair: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: '25%',
    backgroundColor: '#e74c3c',
    padding: 12
  },
});

export default TelaDeAutenticacao;
