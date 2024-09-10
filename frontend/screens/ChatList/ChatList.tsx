import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { db, FIREBASE_AUTH, storage } from '@/configuracao/config';
import { collection, query, where, onSnapshot, getDoc, doc as firestoreDoc, setDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';

interface InterestedUser {
  id: string;
  nomeCompleto: string;
  nomeUsuario: string;
  userId: string;
  animalId: string;
  profilePictureUrl: string | null;
  animalName: string | null;
  animalEmoji: string | null;
}

interface Animal {
  nome: string;
  especie: string;
}

interface Chat {
  id: string;
  animalId: string;
  participantIds: string[];
  ownerId: string;
  ownerInfo: InterestedUser | null;
  animalName: string | null; // Store the animal's name
}

const ChatList: React.FC = () => {
  const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = FIREBASE_AUTH.currentUser;

  const navigation = useNavigation();

  useEffect(() => {
    if (!currentUser) {
      console.log('No current user, stopping process.');
      setLoading(false);
      return;
    }

    // First query for adoptionInterests
    const interestedUsersRef = collection(db, 'adoptionInterests');
    const q1 = query(interestedUsersRef, where('ownerId', '==', currentUser.uid));

    const unsubscribeAdoptionInterests = onSnapshot(q1, async (querySnapshot) => {
      const interestedUsersData: InterestedUser[] = [];

      for (const docSnapshot of querySnapshot.docs) {
        const firebaseData = docSnapshot.data();
        const interestedUserId = firebaseData.interestedUserId;

        // Exclude results where the interestedUserId is the currentUser.uid
        if (interestedUserId === currentUser.uid) {
          console.log('Skipping adoption interest because it belongs to the current user.');
          continue;
        }

        const animalId = firebaseData.animalId;
        const userDocRef = firestoreDoc(db, 'usuarios', interestedUserId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();

          let profilePictureUrl: string | null = null;
          try {
            profilePictureUrl = await getDownloadURL(ref(storage, `images/${interestedUserId}.jpg`));
          } catch (error) {
            console.log('No profile picture found for user:', interestedUserId);
          }

          // Fetch the animal details
          const animalDocRef = firestoreDoc(db, 'animais', animalId);
          const animalDocSnapshot = await getDoc(animalDocRef);
          let animalName = 'Desconhecido';
          let animalEmoji = '❓';

          if (animalDocSnapshot.exists()) {
            const animalData = animalDocSnapshot.data() as Animal;
            animalName = animalData.nome || 'Desconhecido';
            animalEmoji = animalData.especie === 'Cachorro' ? '🐶' : animalData.especie === 'Gato' ? '🐱' : '❓';
          }

          const data: InterestedUser = {
            id: docSnapshot.id,
            nomeCompleto: userData.nomeCompleto || 'Desconhecido',
            nomeUsuario: userData.nomeUsuario || 'Desconhecido',
            userId: interestedUserId,
            animalId: animalId,
            profilePictureUrl: profilePictureUrl,
            animalName: animalName,
            animalEmoji: animalEmoji,
          };

          interestedUsersData.push(data);
        } else {
          console.error('User document not found in usuarios collection:', interestedUserId);
        }
      }

      setInterestedUsers(interestedUsersData);
    }, (error) => {
      console.error('Error fetching adoptionInterests:', error);
    });

    // Second query for chats where currentUser is part of participantIds
    const chatsRef = collection(db, 'chats');
    const q2 = query(chatsRef, where('participantIds', 'array-contains', currentUser.uid));

    const unsubscribeChats = onSnapshot(q2, async (querySnapshot) => {
      const chatsData: Chat[] = [];

      for (const chatDoc of querySnapshot.docs) {
        const chatData = chatDoc.data();
        const ownerId = chatData.ownerId;

        // Exclude results where the ownerId is the currentUser.uid (no self-chat)
        if (ownerId === currentUser.uid) {
          console.log('Skipping chat because the current user is the owner.');
          continue;
        }

        // Fetch owner details similar to interestedUser
        const ownerDocRef = firestoreDoc(db, 'usuarios', ownerId);
        const ownerDocSnapshot = await getDoc(ownerDocRef);

        let ownerInfo: InterestedUser | null = null;
        let animalName: string | null = null;

        if (ownerDocSnapshot.exists()) {
          const ownerData = ownerDocSnapshot.data();

          let profilePictureUrl: string | null = null;
          try {
            profilePictureUrl = await getDownloadURL(ref(storage, `images/${ownerId}.jpg`));
          } catch (error) {
            console.log('No profile picture found for owner:', ownerId);
          }

          ownerInfo = {
            id: chatDoc.id,
            nomeCompleto: ownerData.nomeCompleto || 'Desconhecido',
            nomeUsuario: ownerData.nomeUsuario || 'Desconhecido',
            userId: ownerId,
            animalId: chatData.animalId,
            profilePictureUrl: profilePictureUrl,
            animalName: null,
            animalEmoji: null,
          };

          // Fetch the animal name
          const animalDocRef = firestoreDoc(db, 'animais', chatData.animalId);
          const animalDocSnapshot = await getDoc(animalDocRef);

          if (animalDocSnapshot.exists()) {
            const animalData = animalDocSnapshot.data() as Animal;
            animalName = animalData.nome || 'Desconhecido';
          }
        }

        chatsData.push({
          id: chatDoc.id,
          animalId: chatData.animalId,
          participantIds: chatData.participantIds,
          ownerId: ownerId,
          ownerInfo: ownerInfo,
          animalName: animalName, // Store the animal name
        });
      }

      setChats(chatsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching chats:', error);
    });

    return () => {
      unsubscribeAdoptionInterests();
      unsubscribeChats();
    };
  }, [currentUser]);

  const handleStartChat = async (userId: string, animalId: string) => {
    const chatId = `${currentUser?.uid}_${userId}_${animalId}`;
    const ownerId = currentUser?.uid;

    try {
      const chatDocRef = doc(db, 'chats', chatId);
      const chatSnapshot = await getDoc(chatDocRef);

      if (chatSnapshot.exists()) {
        navigation.navigate('chat', { chatId, animalId, ownerId });
        return;
      }

      await setDoc(chatDocRef, {
        ownerId: ownerId,
        participantIds: [ownerId, userId],
        animalId: animalId,
        createdAt: new Date(),
      });

      navigation.navigate('chat', { chatId, animalId, ownerId });
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleReject = async (userId: string, animalId: string) => {
    // Check if currentUser, userId, and animalId are defined
    if (!currentUser?.uid) {
      console.error('Error: currentUser is undefined.');
      return;
    }
    if (!userId) {
      console.error('Error: userId is undefined.');
      return;
    }
    if (!animalId) {
      console.error('Error: animalId is undefined.');
      return;
    }
  
    console.log(`User ${userId} rejected`);
  
    try {
      // 1. Delete the chat document
      const chatsRef = collection(db, 'chats');
      const chatQuery = query(
        chatsRef,
        where('ownerId', '==', currentUser.uid),
        where('participantIds', 'array-contains', userId),
        where('animalId', '==', animalId)
      );
  
      const chatSnapshot = await getDocs(chatQuery);
  
      if (!chatSnapshot.empty) {
        const chatDoc = chatSnapshot.docs[0]; // Assuming there's only one chat document
        await deleteDoc(chatDoc.ref); // Delete the chat document
        console.log(`Chat with ID: ${chatDoc.id} deleted successfully.`);
      } else {
        console.log('No chat found for this user and animal.');
      }
  
      // 2. Delete the adoption interest document
      const adoptionInterestsRef = collection(db, 'adoptionInterests');
      const interestQuery = query(
        adoptionInterestsRef,
        where('ownerId', '==', currentUser.uid),
        where('interestedUserId', '==', userId),
        where('animalId', '==', animalId)
      );
  
      const interestSnapshot = await getDocs(interestQuery);
  
      if (!interestSnapshot.empty) {
        const interestDoc = interestSnapshot.docs[0]; // Assuming only one adoption interest document
        await deleteDoc(interestDoc.ref); // Delete the adoption interest document
        console.log(`Adoption interest with ID: ${interestDoc.id} deleted successfully.`);
      } else {
        console.log('No adoption interest found for this user and animal.');
      }
  
    } catch (error) {
      console.error('Error deleting chat or adoption interest:', error);
    }
  };

  const renderInterestedUser = ({ item }: { item: InterestedUser }) => (
    <View style={styles.userContainer}>
      <View style={styles.userInfo}>
        <Image
          source={item.profilePictureUrl ? { uri: item.profilePictureUrl } : { uri: 'https://via.placeholder.com/150' }}
          style={styles.profilePicture}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.nomeCompleto}</Text>
          <Text style={styles.userUsername}>@{item.nomeUsuario}</Text>
          {item.animalName && (
            <Text style={styles.animalName}>
              {item.animalEmoji} {item.animalName}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleReject(item.userId, item.animalId)}>
          <Text style={styles.buttonText}>Recusar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.acceptButton]}>
          <Text style={styles.buttonText}>Aceitar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.chatButton]} onPress={() => handleStartChat(item.userId, item.animalId)}>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderChat = ({ item }: { item: Chat }) => (
    <View style={styles.userContainer}>
      {item.ownerInfo && (
        <View style={styles.userInfo}>
          <Image
            source={item.ownerInfo.profilePictureUrl ? { uri: item.ownerInfo.profilePictureUrl } : { uri: 'https://via.placeholder.com/150' }}
            style={styles.profilePicture}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.ownerInfo.nomeCompleto}</Text>
            <Text style={styles.userUsername}>@{item.ownerInfo.nomeUsuario}</Text>
            {item.animalName && <Text style={styles.animalName}>Animal: {item.animalName}</Text>}
          </View>
        </View>
      )}
      <TouchableOpacity
        style={[styles.button, styles.chatButton]}
        onPress={() => navigation.navigate('chat', { chatId: item.id, animalId: item.animalId, ownerId: item.ownerId })}
      >
        <Text style={styles.buttonText}>Ir para o Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.sectionHeader}>Interesses de adoção</Text>
          <FlatList
            data={interestedUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderInterestedUser}
          />
          <Text style={styles.sectionHeader}>Quero adotar</Text>
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={renderChat}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
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
  animalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    textAlign: 'center',
  },
});

export default ChatList;
