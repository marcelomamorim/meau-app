import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db, FIREBASE_AUTH } from '@/configuracao/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

interface Chat {
  id: string;
  animalId: string;
  ownerId: string;
  ownerName: string;
  participantIds: string[];
  animalName: string; // Added animal name to display in the chat title
  createdAt: Date;
}

const ChatList: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participantIds', 'array-contains', currentUser.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsFirestore = querySnapshot.docs.map((doc) => {
        const firebaseData = doc.data();

        console.log('Chat document:', firebaseData); // Debug print

        const data: Chat = {
          id: doc.id,
          animalId: firebaseData.animalId,
          ownerId: firebaseData.ownerId,
          ownerName: firebaseData.ownerName,
          participantIds: firebaseData.participantIds,
          animalName: firebaseData.animalName || 'Unknown Animal', // Use animal name if available
          createdAt: firebaseData.createdAt ? firebaseData.createdAt.toDate() : new Date(),
        };
        return data;
      });
      setChats(chatsFirestore);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('chat', { chatId: item.id, animalId: item.animalId, ownerId: item.ownerId })}
    >
      <Text style={styles.chatTitle}>{item.ownerId}</Text> {/* Display animal name */}
      <Text style={styles.chatSubtitle}>Chat with {item.ownerName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No chats available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  chatTitle: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold', // Use a bold font for the title
    color: '#333',
    marginBottom: 4,
  },
  chatSubtitle: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular', // Use a regular font for the subtitle
    color: '#777',
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 20,
    fontFamily: 'Roboto_400Regular',
  },
});

export default ChatList;
