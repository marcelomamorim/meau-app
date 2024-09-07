import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db, FIREBASE_AUTH } from '@/configuracao/config';
import { collection, query, where, onSnapshot, getDoc, doc as firestoreDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

interface InterestedUser {
  id: string;
  nomeCompleto: string;
  nomeUsuario: string;
  userId: string;
  animalId: string;
}

const ChatList: React.FC = () => {
  const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = FIREBASE_AUTH.currentUser;

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

          const data: InterestedUser = {
            id: docSnapshot.id,
            nomeCompleto: userData.nomeCompleto || 'Unknown',
            nomeUsuario: userData.nomeUsuario || 'Unknown',
            userId: interestedUserId,
            animalId: animalId,
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
    const navigation = useNavigation();
    const chatId = `${currentUser?.uid}_${userId}_${animalId}`;
    console.log(`Starting chat with ID: ${chatId}`);

    // Chat creation logic
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
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{item.nomeCompleto}</Text>
              <Text style={styles.userUsername}>@{item.nomeUsuario}</Text>
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
  userDetails: {
    marginBottom: 12,
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
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
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
  },
});

export default ChatList;
