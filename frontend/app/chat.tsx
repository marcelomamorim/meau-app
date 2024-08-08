import React from 'react';
import AuthorizationLayerWrapper from "../components/AuthorizationLayer";
import ChatScreen from '../screens/Chat/ChatScreen';

const Chat = () => {
    return (
        <>
            <AuthorizationLayerWrapper>
                <ChatScreen>
                </ChatScreen>
            </AuthorizationLayerWrapper>
        </>
    );
};

export default Chat;