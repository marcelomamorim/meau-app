import React from 'react';
import AuthorizationLayerWrapper from "../components/AuthorizationLayer";
import ChatList from '../screens/ChatList/ChatList';

const ChatListScreen = () => {
    return (
        <>
            <AuthorizationLayerWrapper>
                <ChatList>
                </ChatList>
            </AuthorizationLayerWrapper>
        </>
    );
};

export default ChatListScreen;