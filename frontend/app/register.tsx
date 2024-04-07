import React from 'react';

import HeaderComponent from "@/components/HeaderComponent";
import RegisterScreen from "@/screens/Register/RegisterScreen";

const Login = () => {
    return (
        <><HeaderComponent title='Register' leftSideButton='onboard'>
        </HeaderComponent><RegisterScreen>
        </RegisterScreen></>
    );
};

export default Login;