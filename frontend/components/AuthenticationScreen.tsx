import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, SafeAreaView, Platform} from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const TelaDeAutenticacao: React.FC = () => {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);

  const refInputEmail = useRef(null);
  const refInputSenha = useRef(null);

  useEffect(() => {
    setIsEmailValid(email.length === 0 || validateEmail(email)); // Email is considered valid if it's empty or matches the regex
  }, [email]);

  const handleLogin = () => {
    setLoginAttempted(true); // Marca que uma tentativa de login foi feita
    const emailIsValid = validateEmail(email);
    setIsEmailValid(emailIsValid);

    if (!emailIsValid) {
      console.log('O formato do email não é válido.');
      return;
    }
    console.log('Entrar com:', email, senha);
  };

  const handleLoginGoogle = () => console.log('Entrar com Google');
  const handleLoginFacebook = () => console.log('Entrar com Facebook');

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(email);
  };

  return (
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.containerFormulario}>
              {!isEmailValid && loginAttempted && (
                  <Text style={styles.validationMessage}>
                    O formato do email não é válido.
                  </Text>
              )}
              <TextInput
                  ref={refInputEmail}
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  style={styles.input}
                  inputMode="email"
                  readOnly={false}
                  aria-label="Campo de entrada de email"
              />
              <TextInput
                  ref={refInputSenha}
                  label="Senha"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                  mode="outlined"
                  style={styles.input}
                  inputMode="text"
                  readOnly={false}
                  aria-label="Campo de entrada de senha"
              />
            </View>
            <View style={styles.containerBotoes}>
              <Button mode="contained" onPress={handleLogin} style={styles.button} aria-label="Botão de entrar">
                Entrar
              </Button>
              <Button icon="google" mode="outlined" onPress={handleLoginGoogle} style={styles.button} aria-label="Botão de entrar com Google">
                Entrar com Google
              </Button>
              <Button icon="facebook" mode="outlined" onPress={handleLoginFacebook} style={styles.button} aria-label="Botão de entrar com Facebook">
                Entrar com Facebook
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
    paddingBottom: '25%',
    marginLeft: '10%',
    marginRight: '10%',
  },
  containerBotoes: {
    paddingBottom: 40,
    marginLeft: '10%',
    marginRight: '10%',
  },
  input: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  button: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: '7%',
  },
  label: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  validationMessage: {
    alignSelf: 'center',
    color: 'red', // Feel free to adjust the color
    marginBottom: 10,
  },
});

export default TelaDeAutenticacao;
