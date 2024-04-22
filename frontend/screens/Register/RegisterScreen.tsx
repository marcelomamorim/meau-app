import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Alert, Image } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';
import {FIREBASE_AUTH} from "@/config/config";
import {ImagePickerSuccessResult} from "expo-image-picker";
import ImagePickerComponent from "@/components/ImagePickerComponent";


const RegistrationScreen = () => {

    const [formData, setFormData] = useState({
        nomeCompleto: '',
        idade: '',
        email: '',
        estado: '',
        cidade: '',
        endereco: '',
        telefone: '',
        nomeUsuario: '',
        senha: '',
        confirmacaoSenha: '',
    });

    const [error, setError] = useState('');

    const handleTextInputChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleFinishRegister = async () => {
        const { nomeUsuario, senha, confirmacaoSenha } = formData;

        if (!nomeUsuario || !senha || !confirmacaoSenha) {
            setError('Nome de usuário e senha são campos obrigatórios.');
            return;
        }

        if (senha !== confirmacaoSenha) {
            setError('As senhas não coincidem.');
            return;
        }

        const auth = FIREBASE_AUTH;
        try {
            await createUserWithEmailAndPassword(auth, formData.nomeUsuario, senha);
            // Aqui você pode fazer algo após o cadastro, como navegar para outra tela
            Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        } catch (error) {
            setError('Erro ao criar usuário. Por favor, tente novamente.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.infoMessage}>
                <Text style={styles.infoText}>As informações preenchidas serão divulgadas apenas para a pessoa com a qual você realizar o processo de adoção e/ou apadrinhamento, após a formalização do processo.</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                <TextInput placeholder="Nome completo" onChangeText={(text) => handleTextInputChange('nomeCompleto', text)} style={styles.input} />
                <TextInput placeholder="Idade" keyboardType="numeric" onChangeText={(text) => handleTextInputChange('idade', text)} style={styles.input} />
                <TextInput placeholder="Email" keyboardType="email-address" onChangeText={(text) => handleTextInputChange('email', text)} style={styles.input} />
                <TextInput placeholder="Estado" onChangeText={(text) => handleTextInputChange('estado', text)} style={styles.input} />
                <TextInput placeholder="Cidade" onChangeText={(text) => handleTextInputChange('cidade', text)} style={styles.input} />
                <TextInput placeholder="Endereço" onChangeText={(text) => handleTextInputChange('endereco', text)} style={styles.input} />
                <TextInput placeholder="Telefone" keyboardType="phone-pad" onChangeText={(text) => handleTextInputChange('telefone', text)} style={styles.input} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informações de Perfil</Text>
                <TextInput placeholder="Nome do usuário" onChangeText={(text) => handleTextInputChange('nomeUsuario', text)} style={styles.input} />
                <TextInput placeholder="Senha" secureTextEntry onChangeText={(text) => handleTextInputChange('senha', text)} style={styles.input} />
                <TextInput placeholder="Confirmação de senha" secureTextEntry onChangeText={(text) => handleTextInputChange('confirmacaoSenha', text)} style={styles.input} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Foto de Perfil</Text>
                <ImagePickerComponent onImagePicked={() => console.log('componente funcionando')}></ImagePickerComponent>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity onPress={handleFinishRegister} style={styles.finishButton}>
                <Text style={styles.finishButtonText}>Finalizar Cadastro</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#434343'
    },
    input: {
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    finishButton: {
        backgroundColor: '#88c9bf',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    finishButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoMessage: {
        backgroundColor: '#cfe9e5',
        padding: 20,
        marginBottom: 20,
    },
    infoText: {
        textAlign: 'center',
        fontFamily: 'Roboto'
    },
    imagePicker: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: 160,
        height: 160,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        backgroundColor: '#f0f0f0',
    },
    imagePreview: {
        width: 160,
        height: 160,
        borderRadius: 10,
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#808080',
        marginTop: 8,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default RegistrationScreen;
