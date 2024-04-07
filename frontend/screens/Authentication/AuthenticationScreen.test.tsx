import TelaDeAutenticacao from "@/screens/Authentication/AuthenticationScreen";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";


it('exibe uma mensagem de erro para formato de email inválido', () => {
    const { getByLabelText, getByText } = render(<TelaDeAutenticacao />);

    fireEvent.changeText(getByLabelText('Campo de entrada de email'), 'invalidemail');
    fireEvent.press(getByLabelText('Botão de entrar'));

    expect(getByText('O formato do email não é válido.')).toBeTruthy();
});

it('gerencia login com email e senha válidos corretamente', () => {
    console.log = jest.fn();

    const { getByLabelText } = render(<TelaDeAutenticacao />);

    fireEvent.changeText(getByLabelText('Campo de entrada de email'), 'valid@example.com');
    fireEvent.changeText(getByLabelText('Campo de entrada de senha'), 'senha123');
    fireEvent.press(getByLabelText('Botão de entrar'));

    expect(console.log).toHaveBeenCalledWith('Entrar com:', 'valid@example.com', 'senha123');
});

it('impede login com formato de email inválido', () => {
    console.log = jest.fn();

    const { getByLabelText } = render(<TelaDeAutenticacao />);

    fireEvent.changeText(getByLabelText('Campo de entrada de email'), 'invalid');
    fireEvent.press(getByLabelText('Botão de entrar'));

    expect(console.log).not.toHaveBeenCalledWith('Entrar com:', 'invalid', expect.anything());
});

it('gerencia os botões de login social corretamente', () => {
    console.log = jest.fn();

    const { getByLabelText } = render(<TelaDeAutenticacao />);

    fireEvent.press(getByLabelText('Botão de entrar com Google'));
    expect(console.log).toHaveBeenCalledWith('Entrar com Google');

    fireEvent.press(getByLabelText('Botão de entrar com Facebook'));
    expect(console.log).toHaveBeenCalledWith('Entrar com Facebook');
});
