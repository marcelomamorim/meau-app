import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db, FIREBASE_AUTH } from '@/configuracao/config';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

interface InterestedUser {
  id: string;
  userName: string;
  userId: string;
  animalId: string;
}

const ChatList: React.FC = () => {
  const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const interestedUsersRef = collection(db, 'interestedUsers');
    const q = query(interestedUsersRef, where('animalOwnerId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const interestedUsersFirestore = querySnapshot.docs.map((doc) => {
        const firebaseData = doc.data();

        const data: InterestedUser = {
          id: doc.id,
          userName: firebaseData.userName,
          userId: firebaseData.userId,
          animalId: firebaseData.animalId
        };

        return data;
      });
      setInterestedUsers(interestedUsersFirestore);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleStartChat = async (userId: string, animalId: string) => {
    const navigation = useNavigation();
    const chatId = `${currentUser?.uid}_${userId}_${animalId}`;
    await addDoc(collection(db, 'chats'), {
      ownerId: currentUser?.uid,
      participantIds: [currentUser?.uid, userId],
      animalId: animalId,
      createdAt: new Date(),
    });
    console.log(`Chat started with ID: ${chatId}`);
    navigation.navigate('ChatScreen', { chatId });
  };

  const handleAccept = (userId: string) => {
    console.log(`User ${userId} accepted`);
  };

  const handleReject = (userId: string) => {
    console.log(`User ${userId} rejected`);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
      <View style={styles.container}>
        <FlatList
            data={interestedUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.userContainer}>
                  <Text>{item.userName}</Text>
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => handleReject(item.userId)}>
                      <Text>Recusar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleAccept(item.userId)}>
                      <Text>Aceitar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleStartChat(item.userId, item.animalId)}>
                      <Text>Começar Chat</Text>
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
    padding: 16,
  },
  userContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    padding: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
});

export default ChatList;
