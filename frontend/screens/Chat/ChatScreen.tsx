import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, IMessage, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { db, FIREBASE_AUTH } from '@/configuracao/config';
import { collection, doc, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { useRoute, RouteProp } from '@react-navigation/native';
import { View, StyleSheet, Platform, KeyboardAvoidingView, Text } from 'react-native';

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
        return (
            <View style={styles.container}>
                <Text>Informações insuficientes para iniciar o chat.</Text>
            </View>
        );
    }

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [initializedChatId, setInitializedChatId] = useState<string | null>(chatId);

    useEffect(() => {
        const initializeChat = async () => {
            let newChatId = initializedChatId;

            if (!newChatId) {
                const chatRef = await addDoc(collection(db, 'chats'), {
                    animalId: animalId || '',
                    ownerId: ownerId,
                    ownerName: '',
                    participantIds: [currentUser.uid, ownerId],
                    createdAt: serverTimestamp(),
                });
                newChatId = chatRef.id;
                setInitializedChatId(newChatId);
                console.log("Chat created with ID:", newChatId);
            } else {
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
                        console.log("Updating chat participants:", updatedData);
                        await updateDoc(chatRef, updatedData);
                    }
                } else {
                    console.error("Chat document does not exist!");
                }
            }

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

    const renderBubble = (props: any) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#FFD700', // Custom bubble color for the current user
                },
                left: {
                    backgroundColor: '#ECECEC', // Custom bubble color for other users
                },
            }}
            textStyle={{
                right: {
                    color: '#000', // Text color for current user
                },
                left: {
                    color: '#000', // Text color for other users
                },
            }}
        />
    );

    const renderInputToolbar = (props: any) => (
        <InputToolbar
            {...props}
            containerStyle={{
                borderTopWidth: 1,
                borderTopColor: '#ECECEC',
                backgroundColor: '#F3F3F3',
                padding: 5,
            }}
            textInputStyle={{
                color: '#000',
                fontSize: 16,
            }}
        />
    );

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: currentUser.uid,
                    name: currentUser.displayName || 'User',
                }}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                placeholder="Digite sua mensagem..."
            />
            {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});

export default ChatScreen;
