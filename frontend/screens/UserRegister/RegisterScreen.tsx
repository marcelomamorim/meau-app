import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {createUserWithEmailAndPassword} from '@firebase/auth';
import {db, FIREBASE_AUTH} from "@/config/config";
import ImagePickerComponent from "@/components/ImagePickerComponent";
import {router} from "expo-router";
import axios from 'axios';
import {doc, setDoc} from "firebase/firestore";

const brazilianStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];


const RegistrationScreen = () => {

    const [dadosUsuarioCadastro, setDadosUsuarioCadastro] = useState({
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

    const handleCepChange = async (cep: string) => {
        if (cep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const { uf, localidade, logradouro } = response.data;
                console.log(response.data)
                handleTextInputChange('estado', uf);
                handleTextInputChange('cidade', localidade);
                handleTextInputChange('endereco', logradouro);
                console.log(dadosUsuarioCadastro)
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    const addUserToFirestore = async (usuario : any) => {
        try {
            const newPetRef = doc(db, 'usuarios', dadosUsuarioCadastro["email"]);
            await setDoc(newPetRef, usuario);
            console.log('User added successfully:', usuario);
        } catch (error) {
            console.error('Error adding user to Firestore:', error);
            throw error;
        }
    };

    const handleTextInputChange = (name: string, value: string) => {
        setDadosUsuarioCadastro(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFinishRegister = async () => {
        const { nomeUsuario, senha, confirmacaoSenha } = dadosUsuarioCadastro;

        if (!nomeUsuario || !senha || !confirmacaoSenha) {
            setError('Nome de usuário e senha são campos obrigatórios.');
            return;
        }

        if (senha !== confirmacaoSenha) {
            setError('As senhas não coincidem.');
            return;
        }

        try {
            await createUserWithEmailAndPassword(FIREBASE_AUTH, dadosUsuarioCadastro.email, senha).then(
                () => {
                    addUserToFirestore(dadosUsuarioCadastro).then(
                        () => {
                            Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
                            router.navigate('login')
                        },
                        (error) => console.log(error)
                    )
                },
                (error) => console.log(error)
            );
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
                <TextInput autoCapitalize="none"  placeholder="Nome completo" onChangeText={(text) => handleTextInputChange('nomeCompleto', text)} style={styles.input} />
                <TextInput autoCapitalize="none"  placeholder="Idade" keyboardType="numeric" onChangeText={(text) => handleTextInputChange('idade', text)} style={styles.input} />
                <TextInput autoCapitalize="none"  placeholder="Email" keyboardType="email-address" onChangeText={(text) => handleTextInputChange('email', text)} style={styles.input} />
                <TextInput
                    autoCapitalize="none"
                    placeholder="CEP"
                    keyboardType="numeric"
                    onChangeText={(text) => handleCepChange(text)}
                    style={styles.input}
                />
                <TextInput
                    autoCapitalize="none"
                    placeholder="Estado"
                    onChangeText={(text) => handleTextInputChange('estado', text)}
                    value={dadosUsuarioCadastro.estado}
                    style={styles.input}
                />
                <TextInput
                    autoCapitalize="none"
                    placeholder="Cidade"
                    onChangeText={(text) => handleTextInputChange('cidade', text)}
                    value={dadosUsuarioCadastro.cidade}
                    style={styles.input}
                />
                <TextInput
                    autoCapitalize="none"
                    placeholder="Endereço"
                    onChangeText={(text) => handleTextInputChange('endereco', text)}
                    value={dadosUsuarioCadastro.endereco}
                    style={styles.input}
                />
                <TextInput autoCapitalize="none"  placeholder="Telefone" keyboardType="phone-pad" onChangeText={(text) => handleTextInputChange('telefone', text)} style={styles.input} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informações de Perfil</Text>
                <TextInput autoCapitalize="none"  placeholder="Nome do usuário" onChangeText={(text) => handleTextInputChange('nomeUsuario', text)} style={styles.input} />
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
        marginTop: 10,
        marginBottom: 30
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
    pickerContainer: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#cccccc',
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,  // for Android shadow effect
        overflow: 'hidden',  // keeps the inner Picker from overlapping the border
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#333',  // changes the color of the picker items
    },
    pickerTitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        paddingLeft: 10  // Align with the picker text
    },
});

export default RegistrationScreen;
