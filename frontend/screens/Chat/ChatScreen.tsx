import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { db, FIREBASE_AUTH } from '@/configuracao/config';
import { collection, doc, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { useRoute, RouteProp } from '@react-navigation/native';

type ChatParams = {
    chatId: string | null;
    animalId: string | null;
    ownerId: string | null;
};

type ChatScreenRouteProp = RouteProp<{ params: ChatParams }, 'params'>;

const ChatScreen: React.FC = () => {
    const route = useRoute<ChatScreenRouteProp>();
    let { chatId, animalId, ownerId } = route.params;

    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser || !ownerId) {
        return null;
    }

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [initializedChatId, setInitializedChatId] = useState<string | null>(chatId);

    useEffect(() => {
        const initializeChat = async () => {
            let newChatId = initializedChatId;

            if (!newChatId) {
                // Create the chat document with metadata and let Firebase generate the chatId
                const chatRef = await addDoc(collection(db, 'chats'), {
                    animalId: animalId || '',
                    ownerId: ownerId,
                    ownerName: '', // Assume owner's name will be fetched separately or is known
                    participantIds: [currentUser.uid, ownerId],
                    createdAt: serverTimestamp(),
                });
                newChatId = chatRef.id;
                setInitializedChatId(newChatId);
                console.log("Chat created with ID:", newChatId);
            } else {
                // If chat exists, check if current user and ownerId are in participants; if not, add them
                const chatRef = doc(db, 'chats', newChatId);
                const chatSnap = await getDoc(chatRef);
                if (chatSnap.exists()) {
                    const data = chatSnap.data();
                    const participants = data.participantIds || [];
                    const newParticipants = new Set(participants);
                    newParticipants.add(currentUser.uid);
                    newParticipants.add(ownerId);

                    if (newParticipants.size !== participants.length) {
                        const updatedData = {
                            participantIds: Array.from(newParticipants),
                        };
                        console.log("Updating chat participants:", updatedData); // Debug print
                        await updateDoc(chatRef, updatedData);
                    }
                } else {
                    console.error("Chat document does not exist!");
                }
            }

            // Listen for messages in the 'messages' subcollection of the current chat
            const messagesRef = collection(db, 'chats', newChatId, 'messages');
            const q = query(messagesRef, orderBy('timestamp', 'desc'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messagesFirestore = querySnapshot.docs.map((doc) => {
                    const firebaseData = doc.data();

                    const data: IMessage = {
                        _id: doc.id,
                        text: firebaseData.text,
                        createdAt: firebaseData.timestamp ? firebaseData.timestamp.toDate() : new Date(),
                        user: {
                            _id: firebaseData.senderId,
                            name: firebaseData.senderName,
                        },
                    };
                    return data;
                });
                setMessages(messagesFirestore);
            });

            return () => unsubscribe();
        };

        initializeChat();
    }, [initializedChatId]);

    const onSend = useCallback((messages: IMessage[] = []) => {
        if (!initializedChatId) return;
        const { text } = messages[0];
        const messagesRef = collection(db, 'chats', initializedChatId, 'messages');
        addDoc(messagesRef, {
            text,
            timestamp: serverTimestamp(),
            senderId: currentUser.uid,
            senderName: currentUser.displayName || 'User',
        });
    }, [initializedChatId]);

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: currentUser.uid,
                name: currentUser.displayName || 'User',
            }}
        />
    );
};

export default ChatScreen;
