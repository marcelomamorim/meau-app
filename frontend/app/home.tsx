import React from 'react';

import HomeScreen from "@/screens/Home/HomeScreen";
import AuthorizationLayerWrapper from '@/components/AuthorizationLayer';

const Home = () => {
    return (
        <>
            <AuthorizationLayerWrapper>
                <HomeScreen>
                </HomeScreen>
            </AuthorizationLayerWrapper>
        </>
    );
};

export default Home;