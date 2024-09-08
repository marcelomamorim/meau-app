import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { FIREBASE_AUTH, storage } from '../configuracao/config'; // Ensure the path is correct
import { MaterialIcons } from '@expo/vector-icons';
import { getDownloadURL, ref } from 'firebase/storage';
import { router } from 'expo-router';

import HomeScreen from '@/screens/Home/HomeScreen';
import CadastroAnimalScreen from '@/screens/AnimalRegister/AnimalRegisterScreen';
import LoginScreen from '@/screens/Authentication/AuthenticationScreen';
import CadastroPessoaScreen from '@/screens/UserRegister/RegisterScreen'
import AdotarScreen from '@/screens/Adotar/AdotarFeed'
import ProfileAnimalScreen from '@/screens/AnimalProfile/AnimalProfile'
import PerfilScreen from '@/screens/Perfil/UserProfile'
import MeusChatsScreen from '@/screens/ChatList/ChatList'
import ChatScreen from '@/screens/Chat/ChatScreen';
import AuthorizationLayerWrapper from '@/components/AuthorizationLayer';


const Drawer = createDrawerNavigator(); // Create Drawer Navigator

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    photoURL: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const profilePictureRef = ref(storage, `images/${user.uid}.jpg`);

        try {
          const photoURL = await getDownloadURL(profilePictureRef);
          setUserProfile({
            name: user.displayName || 'Usuário',
            photoURL: photoURL,
          });
        } catch (error) {
          console.error('Erro ao buscar foto de perfil:', error);
          setUserProfile({
            name: user.displayName || 'Usuário',
            photoURL: 'https://via.placeholder.com/150', // Placeholder if no image found
          });
        }
        setLoading(false);
      } else {
        setIsAuthenticated(false);
        setUserProfile({
          name: '',
          photoURL: '',
        });
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Remove the listener when the component unmounts
  }, []);

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      FIREBASE_AUTH.signOut(); // Perform logout
      setIsAuthenticated(false); // Update state after logout
    } else {
      router.navigate('/login'); // Navigate to the login screen
    }
  };

  const CustomDrawerContent = (props : any) => (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            <Image
              source={{ uri: userProfile.photoURL }}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>{userProfile.name}</Text>
          </>
        )}
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
        drawerStyle: {
        backgroundColor: '#88c9bf', // Light blue background
        width: 240,
        },
        drawerActiveTintColor: '#0288D1', // Darker blue for active item
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
        fontSize: 16,
        fontFamily: 'Roboto_700Bold',
        },
        headerStyle: {
        backgroundColor: '#88c9bf', // Light blue header
        },
        headerTintColor: '#000', // Black text color for better contrast
        headerTitleStyle: {
        fontFamily: 'Roboto_700Bold',
        },
    }}
    >
    <Drawer.Screen
        name="home"
        component={() => (
            <AuthorizationLayerWrapper>
                <HomeScreen />
            </AuthorizationLayerWrapper>
        )}
        options={{
        drawerLabel: 'Home',
        title: 'Home',
        drawerIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
        ),
        }}
    />
    <Drawer.Screen
        name="adotar"
        component={() => (
            <AuthorizationLayerWrapper>
                <AdotarScreen />
            </AuthorizationLayerWrapper>
        )}
        options={{
        drawerLabel: 'Adotar Pet',
        title: 'Adotar Pet',
        drawerIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" color={color} size={size} />
        ),
        }}
    />
    <Drawer.Screen
        name="perfil"
        component={() => (
            <AuthorizationLayerWrapper>
                <PerfilScreen />
            </AuthorizationLayerWrapper>
        )}
        options={{
        drawerLabel: 'Meu Perfil',
        title: 'Meu Perfil',
        drawerIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
        ),
        }}
    />
    <Drawer.Screen
        name="meus-chats"
        component={() => (
            <AuthorizationLayerWrapper>
                <MeusChatsScreen />
            </AuthorizationLayerWrapper>
        )}
        options={{
        drawerLabel: 'Chats',
        title: 'Chats',
        drawerIcon: ({ color, size }) => (
            <MaterialIcons name="chat" color={color} size={size} />
        ),
        }}
    />
    <Drawer.Screen
        name="cadastrar-animal"
        component={() => (
            <AuthorizationLayerWrapper>
                <CadastroAnimalScreen />
            </AuthorizationLayerWrapper>
        )}
        options={{
        drawerLabel: 'Cadastro de Animal',
        title: 'Cadastro de Animal',
        drawerIcon: ({ color, size }) => (
            <MaterialIcons name="pets" color={color} size={size} />
        ),
        }}
    />
    <Drawer.Screen
        name="cadastro-pessoa"
        component={CadastroPessoaScreen}
        options={{
        drawerLabel: 'Cadastro de Usuário',
        title: 'Cadastro de Usuário',
        drawerIcon: ({ color, size }) => (
            <MaterialIcons name="person-add" color={color} size={size} />
        ),
        }}
    />
    <Drawer.Screen
        name="login"
        component={LoginScreen}
        options={{
        drawerLabel: isAuthenticated ? 'Logout' : 'Login',
        title: isAuthenticated ? 'Logout' : 'Login',
        drawerIcon: ({ color, size }) => (
            <MaterialIcons name={isAuthenticated ? 'logout' : 'login'} color={color} size={size} />
        ),
        onPress: handleLoginLogout,
        }}
    />
      <Drawer.Screen
          name="chat"
          component={() => (
            <AuthorizationLayerWrapper>
                <ChatScreen />
            </AuthorizationLayerWrapper>
        )}
          options={{
            drawerLabel: '',
            title: ''
          }}
        />
    <Drawer.Screen
        name="profile-animal"
        component={ProfileAnimalScreen}
        options={{
        drawerLabel: '',
        title: ''
        }}
    />
    </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#66CDAA', // Add background color to the header part
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Makes the image circular
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
