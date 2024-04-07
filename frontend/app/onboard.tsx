import React from 'react';

import OnboardingScreen from "@/screens/Onboard/OnboardingScreen";
import HeaderComponent from "@/components/HeaderComponent";

const Onboard = () => {
    return (
        <><HeaderComponent title='Cadastro' leftSideButton=''>
        </HeaderComponent>
        <OnboardingScreen>
        </OnboardingScreen></>
    );
};

export default Onboard;