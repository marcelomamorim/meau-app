import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { db, FIREBASE_AUTH, storage } from '@/configuracao/config';
import { collection, query, where, onSnapshot, getDoc, doc as firestoreDoc, setDoc, getDocs, deleteDoc, addDoc } from 'firebase/firestore';
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
  animalName: string | null;
}

const ChatList: React.FC = () => {
  const [interestedUsers, setInterestedUsers] = useState<InterestedUser[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const currentUser = FIREBASE_AUTH.currentUser;

  const navigation = useNavigation();

  useEffect(() => {
    console.log('Component mounted. Checking if user is logged in.');
    
    if (!currentUser) {
      console.log('No current user, stopping process.');
      setLoading(false);
      return;
    }

    console.log('Fetching adoption interests for user:', currentUser.uid);

    // First query for adoptionInterests
    const interestedUsersRef = collection(db, 'adoptionInterests');
    const q1 = query(interestedUsersRef, where('ownerId', '==', currentUser.uid));

    const unsubscribeAdoptionInterests = onSnapshot(q1, async (querySnapshot) => {
      const interestedUsersData: InterestedUser[] = [];

      console.log('Received snapshot for adoptionInterests:', querySnapshot.size, 'documents');

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
          console.log('User data found for interestedUserId:', interestedUserId);

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
            console.log('Animal data fetched for animalId:', animalId);
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

      console.log('Setting interestedUsers state with data:', interestedUsersData);
      setInterestedUsers(interestedUsersData);
    }, (error) => {
      console.error('Error fetching adoptionInterests:', error);
    });

    console.log('Fetching chats where currentUser is part of participantIds');

    // Second query for chats where currentUser is part of participantIds
    const chatsRef = collection(db, 'chats');
    const q2 = query(chatsRef, where('participantIds', 'array-contains', currentUser.uid));

    const unsubscribeChats = onSnapshot(q2, async (querySnapshot) => {
      const chatsData: Chat[] = [];

      console.log('Received snapshot for chats:', querySnapshot.size, 'documents');

      for (const chatDoc of querySnapshot.docs) {
        const chatData = chatDoc.data();
        const ownerId = chatData.ownerId;

        // Exclude results where the ownerId is the currentUser.uid (no self-chat)
        if (ownerId === currentUser.uid) {
          console.log('Skipping chat because the current user is the owner.');
          continue;
        }

        const ownerDocRef = firestoreDoc(db, 'usuarios', ownerId);
        const ownerDocSnapshot = await getDoc(ownerDocRef);

        let ownerInfo: InterestedUser | null = null;
        let animalName: string | null = null;

        if (ownerDocSnapshot.exists()) {
          const ownerData = ownerDocSnapshot.data();
          console.log('Owner data found for ownerId:', ownerId);

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

          const animalDocRef = firestoreDoc(db, 'animais', chatData.animalId);
          const animalDocSnapshot = await getDoc(animalDocRef);

          if (animalDocSnapshot.exists()) {
            const animalData = animalDocSnapshot.data() as Animal;
            animalName = animalData.nome || 'Desconhecido';
            console.log('Animal data fetched for chat:', chatData.animalId);
          }
        }

        chatsData.push({
          id: chatDoc.id,
          animalId: chatData.animalId,
          participantIds: chatData.participantIds,
          ownerId: ownerId,
          ownerInfo: ownerInfo,
          animalName: animalName,
        });
      }

      console.log('Setting chats state with data:', chatsData);
      setChats(chatsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching chats:', error);
    });

    return () => {
      console.log('Cleaning up onSnapshot listeners.');
      unsubscribeAdoptionInterests();
      unsubscribeChats();
    };
  }, [currentUser]);

  const handleStartChat = async (userId: string, animalId: string) => {
    const chatId = `${currentUser?.uid}_${userId}_${animalId}`;
    const ownerId = currentUser?.uid;
    console.log('Starting chat with ID:', chatId);

    try {
      const chatDocRef = firestoreDoc(db, 'chats', chatId);
      const chatSnapshot = await getDoc(chatDocRef);

      if (chatSnapshot.exists()) {
        console.log('Chat already exists. Navigating to chat screen.');
        navigation.navigate('chat', { chatId, animalId, ownerId });
        return;
      }

      await setDoc(chatDocRef, {
        ownerId: ownerId,
        participantIds: [ownerId, userId],
        animalId: animalId,
        createdAt: new Date(),
      });

      console.log('Chat successfully created. Navigating to chat screen.');
      navigation.navigate('chat', { chatId, animalId, ownerId });
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleReject = async (userId: string, animalId: string) => {
    console.log(`Rejecting user ${userId} for animal ${animalId}`);

    if (!currentUser?.uid || !userId || !animalId) {
      console.log('Invalid parameters for rejection.');
      return;
    }

    try {
      const chatsRef = collection(db, 'chats');
      const chatQuery = query(
        chatsRef,
        where('ownerId', '==', currentUser.uid),
        where('participantIds', 'array-contains', userId),
        where('animalId', '==', animalId)
      );

      const chatSnapshot = await getDocs(chatQuery);

      if (!chatSnapshot.empty) {
        const chatDoc = chatSnapshot.docs[0];
        await deleteDoc(chatDoc.ref);
        console.log(`Chat with ID: ${chatDoc.id} deleted successfully.`);
      } else {
        console.log('No chat found for this user and animal.');
      }

      const adoptionInterestsRef = collection(db, 'adoptionInterests');
      const interestQuery = query(
        adoptionInterestsRef,
        where('ownerId', '==', currentUser.uid),
        where('interestedUserId', '==', userId),
        where('animalId', '==', animalId)
      );

      const interestSnapshot = await getDocs(interestQuery);

      if (!interestSnapshot.empty) {
        const interestDoc = interestSnapshot.docs[0];
        await deleteDoc(interestDoc.ref);
        console.log(`Adoption interest with ID: ${interestDoc.id} deleted successfully.`);
      } else {
        console.log('No adoption interest found for this user and animal.');
      }

    } catch (error) {
      console.error('Error deleting chat or adoption interest:', error);
    }
  };

  const handleFinishProcess = async (userId: string, animalId: string) => {
    console.log('Finishing adoption process for user:', userId, 'and animal:', animalId);

    try {
      // Add a new document to the adoptionProcess collection
      const adoptionProcessRef = collection(db, 'adoptionProcess');
      await addDoc(adoptionProcessRef, {
        animalId: animalId,
        ownerId: currentUser?.uid,
        situacao: 'Concluído',
        createdAt: new Date(),
      });

      console.log('Adoption process successfully registered.');

      // Set the success message
      setSuccessMessage('Processo de adoção concluído com sucesso!');

      // After a delay (optional), clear the success message and call handleReject
      setTimeout(() => {
        setSuccessMessage(null);
        handleReject(userId, animalId);
      }, 5000); // Delay of 5 seconds

    } catch (error) {
      console.error('Error finishing adoption process:', error);
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
        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleFinishProcess(item.userId, item.animalId)}>
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
          {successMessage && (
            <View style={styles.successMessageContainer}>
              <Text style={styles.successMessage}>{successMessage}</Text>
            </View>
          )}
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
  successMessageContainer: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  successMessage: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ChatList;
