import React from 'react';
import AnimalRegisterScreen from "@/screens/AnimalRegister/AnimalRegisterScreen";
import AuthorizationLayerWrapper from "@/components/AuthorizationLayer";

const CadastroAnimal = () => {
    return (
        <>
            <AuthorizationLayerWrapper>
                <AnimalRegisterScreen>
                </AnimalRegisterScreen>
            </AuthorizationLayerWrapper>
        </>
    );
};

export default CadastroAnimal;
