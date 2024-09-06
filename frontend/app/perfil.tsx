import React from 'react';
import AuthorizationLayerWrapper from "../components/AuthorizationLayer";
import UserProfile from "../screens/Perfil/UserProfile";


const Profile = () => {
    return (
        <>
            <AuthorizationLayerWrapper>
                <UserProfile>
                </UserProfile>
            </AuthorizationLayerWrapper>
        </>
    );
};

export default Profile;
