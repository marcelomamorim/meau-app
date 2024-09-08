import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, IMessage, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { db, FIREBASE_AUTH } from '@/configuracao/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ChatParams = {
    chatId: string | null;
    animalId: string | null;
    ownerId: string | null;
};

type ChatScreenRouteProp = RouteProp<{ params: ChatParams }, 'params'>;

const ChatScreen: React.FC = () => {
    const route = useRoute<ChatScreenRouteProp>();
    const { chatId, animalId, ownerId } = route.params;
    const navigation = useNavigation();

    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser || !ownerId || !chatId) {
        return (
            <View style={styles.container}>
                <Text>Informações insuficientes para iniciar o chat.</Text>
            </View>
        );
    }

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
    }, [chatId]);

    const onSend = useCallback((messages: IMessage[] = []) => {
        const { text } = messages[0];
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        addDoc(messagesRef, {
            text,
            timestamp: serverTimestamp(),
            senderId: currentUser.uid,
            senderName: currentUser.displayName || 'User',
        });
    }, [chatId]);

    const renderBubble = (props: any) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#66CDAA', // Green color for sent messages
                    borderRadius: 20,
                    padding: 8,
                },
                left: {
                    backgroundColor: '#F0F0F0', // Gray color for received messages
                    borderRadius: 20,
                    padding: 8,
                },
            }}
            textStyle={{
                right: {
                    color: '#fff', // White text for sent messages
                },
                left: {
                    color: '#333', // Dark text for received messages
                },
            }}
            containerToNextStyle={{
                right: { marginBottom: 7 }, // Space between consecutive sent messages
                left: { marginBottom: 7 },  // Space between consecutive received messages
            }}
            containerToPreviousStyle={{
                right: { marginTop: 7 },   // Space between messages from different users
                left: { marginTop: 7 },    // Space between messages from different users
            }}
        />
    );    

    const renderInputToolbar = (props: any) => (
        <InputToolbar
            {...props}
            containerStyle={{
                borderTopWidth: 1,
                borderTopColor: '#ECECEC',
                backgroundColor: '#F5F5F5',
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 25,
                margin: 10,
            }}
            textInputStyle={{
                color: '#333',
                fontSize: 16,
            }}
        />
    );

    return (
        <View style={styles.flexContainer}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.returnButton} onPress={() => navigation.navigate('meus-chats')}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.returnText}>Voltar</Text>
                </TouchableOpacity>
            </View>

            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: currentUser.uid,
                    name: currentUser.displayName || 'User',
                }}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                placeholder="Escreva sua mensagem..."
                alwaysShowSend
                showAvatarForEveryMessage={false}
                scrollToBottom
                scrollToBottomComponent={() => <Ionicons name="ios-arrow-down" size={24} color="#66CDAA" />}
                bottomOffset={0}
                listViewProps={{
                    contentContainerStyle: { paddingTop: 60 }, // Add extra space at the top of the messages
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        backgroundColor: '#E8F0F2', // Light background color
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#66CDAA', // Header color
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    returnButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    returnText: {
        marginLeft: 8,
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ChatScreen;
