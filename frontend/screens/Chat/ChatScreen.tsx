import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { db, FIREBASE_AUTH } from '@/configuracao/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

interface ChatScreenProps {
    route: {
        params: {
            chatId: string;
            animalId: string;
            ownerId: string;
        };
    };
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
    const { chatId } = route.params;
    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesFirestore = querySnapshot.docs.map((doc) => {
                const firebaseData = doc.data();

                const data: IMessage = {
                    _id: doc.id,
                    text: firebaseData.text,
                    createdAt: new Date(firebaseData.timestamp.seconds * 1000),
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
    }, [chatId]);

    const onSend = useCallback((messages: IMessage[] = []) => {
        const { _id, createdAt, text, user } = messages[0];
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        addDoc(messagesRef, {
            _id,
            text,
            timestamp: serverTimestamp(),
            senderId: user._id,
            senderName: user.name,
        });
    }, [chatId]);

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: FIREBASE_AUTH.currentUser?.uid || '',
                name: FIREBASE_AUTH.currentUser?.displayName || 'User',
            }}
        />
    );
};

export default ChatScreen;
