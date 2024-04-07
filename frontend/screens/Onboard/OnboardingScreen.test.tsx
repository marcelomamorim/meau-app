import {fireEvent, render} from "@testing-library/react-native";
import {router} from "expo-router";
import React from "react";
import OnboardingScreen from "@/screens/Onboard/OnboardingScreen";

describe('Tela de Onboarding', () => {
    it('renderiza corretamente', () => {
        const { getByText } = render(<OnboardingScreen />);
        expect(getByText('Ops!')).toBeTruthy();
        expect(getByText('Você não pode realizar esta ação sem possuir um cadastro.')).toBeTruthy();
        expect(getByText('Fazer Cadastro')).toBeTruthy();
        expect(getByText('Já possui cadastro?')).toBeTruthy();
        expect(getByText('Fazer Login')).toBeTruthy();
    });

    it('exibe mensagens e botões esperados', () => {
        const { getByText } = render(<OnboardingScreen />);
        expect(getByText('Ops!')).toBeTruthy();
        expect(getByText('Você não pode realizar esta ação sem possuir um cadastro.')).toBeTruthy();
        expect(getByText('Fazer Cadastro')).toBeTruthy();
        expect(getByText('Já possui cadastro?')).toBeTruthy();
        expect(getByText('Fazer Login')).toBeTruthy();
    });
});
