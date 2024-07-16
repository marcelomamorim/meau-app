import React from 'react';
import AuthorizationLayerWrapper from "@/components/AuthorizationLayer";
import DetailedAnimalScreen from '@/screens/AnimalProfile/AnimalProfile';

const ProfileAnimal = () => {
    return (
        <>
            <AuthorizationLayerWrapper>
                <DetailedAnimalScreen>
                </DetailedAnimalScreen>
            </AuthorizationLayerWrapper>
        </>
    );
};

export default ProfileAnimal;