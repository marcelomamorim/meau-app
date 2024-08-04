import React from 'react';
import AuthorizationLayerWrapper from "../components/AuthorizationLayer";
import AdotarFeed from '../screens/Adotar/AdotarFeed';

const Adotar = () => {
    return (
        <>
            <AuthorizationLayerWrapper>
                <AdotarFeed>
                </AdotarFeed>
            </AuthorizationLayerWrapper>
        </>
    );
};

export default Adotar;
