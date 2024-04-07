import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text, AccessibilityInfo, findNodeHandle, Platform } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const AuthScreen: React.FC = () => {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);

  const handleLogin = () => {
    console.log('Login with:', email, password);
  };

  const handleGoogleLogin = () => {
    console.log('Login with Google');
  };

  const handleFacebookLogin = () => {
    console.log('Login with Facebook');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          ref={emailRef}
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          textContentType="emailAddress" // iOS only
          accessible={true}
          accessibilityLabel="Email Address Field"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          textContentType="password" // iOS only
          accessible={true}
          accessibilityLabel="Password Field"
        />
        <Button mode="contained" onPress={handleLogin} style={styles.button} accessibilityLabel="Log in">
          Entrar
        </Button>
        <Button icon="google" mode="outlined" onPress={handleGoogleLogin} style={styles.button} accessibilityLabel="Log in with Google">
          Login with Google
        </Button>
        <Button icon="facebook" mode="outlined" onPress={handleFacebookLogin} style={styles.button} accessibilityLabel="Log in with Facebook">
          Login with Facebook
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
  },
  container: {
    width: '100%', // Ensure the container takes up the full width of the scrollViewContainer
    alignItems: 'center', // Center children horizontally
  },
  input: {
    width: '95%', // Increased width for more prominence
    marginBottom: 20,
  },
  button: {
    width: '95%', // Increased width for more prominence
    marginBottom: 20,
  },
  label: {
    alignSelf: 'center', // Ensure labels are also centered
    marginBottom: 10,
  },
});

export default AuthScreen;
