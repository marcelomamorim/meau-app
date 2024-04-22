import React, { useState, useRef } from 'react';
import {View, StyleSheet, ScrollView, KeyboardAvoidingView, SafeAreaView, Platform, Alert} from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const TelaDeAutenticacao: React.FC = () => {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const refInputEmail = useRef(null);
  const refInputSenha = useRef(null);

  const handleLogin = () => {
    console.log('login')
  };

  const handleLoginGoogle = () => console.log('Entrar com Google');
  const handleLoginFacebook = () => console.log('Entrar com Facebook');

  return (
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.containerFormulario}>
              <TextInput
                  ref={refInputEmail}
                  label="Nome de usuário"
                  value={nomeUsuario}
                  onChangeText={setNomeUsuario}
                  mode="outlined"
                  underlineColor= 'transparent'
                  style={styles.input}
                  theme={{ colors: { primary: '#000', background: '#fff' } }}
              />
              <TextInput
                  ref={refInputSenha}
                  label="Senha"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                  mode="outlined"
                  underlineColor= "transparent"
                  style={styles.input}
                  theme={{ colors: { primary: '#000', background: '#fff' } }}
              />
            </View>
            <View style={styles.containerBotoes}>
              <Button
                  mode="contained"
                  onPress={handleLogin}
                  style={styles.botaoEntrar}
                  labelStyle={styles.buttonLabel}
              >
                ENTRAR
              </Button>
              <Button
                  icon="facebook"
                  mode="contained"
                  onPress={handleLoginFacebook}
                  style={[styles.botao, styles.botaoEntrarFacebook]}
                  labelStyle={styles.buttonLabel}
              >
                ENTRAR COM FACEBOOK
              </Button>
              <Button
                  icon="google"
                  mode="contained"
                  onPress={handleLoginGoogle}
                  style={[styles.botao, styles.botaoEntrarGoogle]}
                  labelStyle={styles.buttonLabel}
              >
                ENTRAR COM GOOGLE
              </Button>
            </View>
          </ScrollView>
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
