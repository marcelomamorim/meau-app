import React from 'react';
import HeaderComponent from "@/components/HeaderComponent";
import AnimalRegisterScreen from "@/screens/AnimalRegister/AnimalRegisterScreen";

const Login = () => {
    return (
        <><HeaderComponent title='Cadastro Animal' leftSideButton='onboard'>
        </HeaderComponent><AnimalRegisterScreen>
        </AnimalRegisterScreen></>
    );
};

export default Login;
