import React from 'react';
import AuthenticationScreen from "@/screens/Authentication/AuthenticationScreen";
import HeaderComponent from "@/components/HeaderComponent";


const Login = () => {
    return (
        <><HeaderComponent title='Login' leftSideButton='onboard'>
        </HeaderComponent><AuthenticationScreen>
        </AuthenticationScreen></>
    );
};

export default Login;
