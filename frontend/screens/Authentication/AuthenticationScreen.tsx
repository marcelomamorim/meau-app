import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, SafeAreaView, Platform} from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const TelaDeAutenticacao: React.FC = () => {

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const refInputEmail = useRef(null);
  const refInputSenha = useRef(null);

  const handleLogin = () => {
    console.log('Entrar com:', nomeUsuario, senha);
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
                  mode="flat"
                  style={styles.input}
                  underlineColor="transparent"
                  inputMode="text"
                  readOnly={false}
                  theme={{ colors: { primary: '#000', background: '#F5F5F5' }}}
                  aria-label="Campo de entrada de email"
              />
              <TextInput
                  ref={refInputSenha}
                  label="Senha"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                  mode="flat"
                  underlineColor="transparent"
                  style={styles.input}
                  inputMode="text"
                  readOnly={false}
                  theme={{ colors: { primary: '#000', background: '#F5F5F5' }}}
                  aria-label="Campo de entrada de senha"
              />
            </View>
            <View style={styles.containerBotoes}>
              <Button mode="contained"
                      onPress={handleLogin}
                      style={styles.botaoEntrar}
                      aria-label="Botão de entrar"
              >
                ENTRAR
              </Button>
              <Button icon="facebook" mode="outlined" onPress={handleLoginFacebook} style={styles.botaoEntrarFacebook} aria-label="Botão de entrar com Facebook">
                ENTRAR COM FACEBOOK
              </Button>
              <Button icon="google" mode="outlined" onPress={handleLoginGoogle} style={styles.botaoEntrarGoogle} aria-label="Botão de entrar com Google">
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
  botaoEntrarGoogle: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: '7%',
    padding: 12
  },
  botaoEntrarFacebook: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: '7%',
    padding: 12
  },
  label: {
    alignSelf: 'center',
    marginBottom: 10,
  }
});

export default TelaDeAutenticacao;
