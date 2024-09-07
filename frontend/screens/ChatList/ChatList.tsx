import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { db, FIREBASE_AUTH, storage } from '@/configuracao/config';
import { collection, query, where, onSnapshot, getDoc, doc as firestoreDoc, addDoc, getDocs, setDoc, doc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';

interface InterestedUser {
  id: string;
  nomeCompleto: string;
  nomeUsuario: string;
  userId: string;
  animalId: string;
  profilePictureUrl: string | null;
}

const ChatList: React.FC = () => {
  const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = FIREBASE_AUTH.currentUser;

  // Move useNavigation to the top level
  const navigation = useNavigation();

  useEffect(() => {
    if (!currentUser) {
      console.log('No current user, stopping process.');
      setLoading(false);
      return;
    }

    const interestedUsersRef = collection(db, 'adoptionInterests');
    const q = query(interestedUsersRef, where('ownerId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      console.log('Snapshot received, number of documents:', querySnapshot.size);

      const interestedUsersData: InterestedUser[] = [];

      for (const docSnapshot of querySnapshot.docs) {
        const firebaseData = docSnapshot.data();
        const interestedUserId = firebaseData.interestedUserId;
        const animalId = firebaseData.animalId;

        const userDocRef = firestoreDoc(db, 'usuarios', interestedUserId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();

          // Get profile picture URL from Firebase Storage
          let profilePictureUrl: string | null = null;
          try {
            profilePictureUrl = await getDownloadURL(ref(storage, `images/${interestedUserId}.jpg`));
          } catch (error) {
            console.log('No profile picture found for user:', interestedUserId);
          }

          const data: InterestedUser = {
            id: docSnapshot.id,
            nomeCompleto: userData.nomeCompleto || 'Unknown',
            nomeUsuario: userData.nomeUsuario || 'Unknown',
            userId: interestedUserId,
            animalId: animalId,
            profilePictureUrl: profilePictureUrl,
          };

          interestedUsersData.push(data);
        } else {
          console.error('User document not found in usuarios collection:', interestedUserId);
        }
      }

      setInterestedUsers(interestedUsersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching data from Firestore:', error);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  const handleStartChat = async (userId: string, animalId: string) => {
    const chatId = `${currentUser?.uid}_${userId}_${animalId}`;
    const ownerId = currentUser?.uid;
    console.log(`Starting chat with ID: ${chatId}`);
  
    try {
      // Reference the chat by its chatId
      const chatDocRef = doc(db, 'chats', chatId);
  
      // Get the chat document to check if it exists
      const chatSnapshot = await getDoc(chatDocRef);
  
      // If the chat already exists, navigate to the chat screen
      if (chatSnapshot.exists()) {
        console.log('Chat already exists');
        navigation.navigate('chat', { chatId, animalId, ownerId });
        return; // Stop the function here, since the chat already exists
      }
  
      // If chat does not exist, create a new chat with the given chatId as the document ID
      await setDoc(chatDocRef, {
        ownerId: ownerId,
        participantIds: [ownerId, userId],
        animalId: animalId,
        createdAt: new Date(),
      });
  
      console.log(`Chat successfully started with ID: ${chatId}`);
  
      // Navigate to the chat screen, passing chatId, animalId, and ownerId as params
      navigation.navigate('chat', { chatId, animalId, ownerId });
  
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleAccept = (userId: string) => {
    console.log(`User ${userId} accepted`);
  };

  const handleReject = (userId: string) => {
    console.log(`User ${userId} rejected`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#88c9bf" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={interestedUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <View style={styles.userInfo}>
              <Image
                source={item.profilePictureUrl ? { uri: item.profilePictureUrl } : { uri: 'https://via.placeholder.com/150' }}
                style={styles.profilePicture}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item.nomeCompleto}</Text>
                <Text style={styles.userUsername}>@{item.nomeUsuario}</Text>
              </View>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleReject(item.userId)}>
                <Text style={styles.buttonText}>Recusar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAccept(item.userId)}>
                <Text style={styles.buttonText}>Aceitar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.chatButton]} onPress={() => handleStartChat(item.userId, item.animalId)}>
                <Text style={styles.buttonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  userContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userUsername: {
    fontSize: 14,
    color: '#777',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: '#ff6b6b',
  },
  acceptButton: {
    backgroundColor: '#4caf50',
  },
  chatButton: {
    backgroundColor: '#88c9bf',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ChatList;
