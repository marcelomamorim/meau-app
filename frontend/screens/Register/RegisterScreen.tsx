import React, {useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
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

    const handleTextInputChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleFinishRegister = async () => {
        console.log('registro')
    };

    return (
        <ScrollView style={styles.container} alwaysBounceVertical={true}>
            <View style={styles.infoMessage}>
                <Text style={styles.infoText}>As informações preenchidas serão divulgadas apenas para a pessoa com a qual você realizar o processo de adoção e/ou apadrinhamento, após a formalização do processo.</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                <TextInput placeholderTextColor='#bdbdbd' placeholder="Nome completo" onChangeText={(text) => handleTextInputChange('nomeCompleto', text)} style={styles.input} />
                <TextInput placeholderTextColor='#bdbdbd' placeholder="Idade" keyboardType="numeric" onChangeText={(text) => handleTextInputChange('idade', text)} style={styles.input} />
                <TextInput placeholderTextColor='#bdbdbd' placeholder="Email" keyboardType="email-address" onChangeText={(text) => handleTextInputChange('email', text)} style={styles.input} />
                <TextInput placeholderTextColor='#bdbdbd' placeholder="Estado" onChangeText={(text) => handleTextInputChange('estado', text)} style={styles.input} />
                <TextInput placeholderTextColor='#bdbdbd' placeholder="Cidade" onChangeText={(text) => handleTextInputChange('cidade', text)} style={styles.input} />
                <TextInput placeholderTextColor='#bdbdbd' placeholder="Endereço" onChangeText={(text) => handleTextInputChange('endereco', text)} style={styles.input} />
                <TextInput placeholderTextColor='#bdbdbd' placeholder="Telefone" keyboardType="phone-pad" onChangeText={(text) => handleTextInputChange('telefone', text)} style={styles.input} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informações de Perfil</Text>
                <TextInput placeholderTextColor='#bdbdbd' placeholder="Nome do usuário" onChangeText={(text) => handleTextInputChange('nomeUsuario', text)} style={styles.input} />
                <TextInput placeholderTextColor='#bdbdbd' placeholder="Senha" secureTextEntry onChangeText={(text) => handleTextInputChange('senha', text)} style={styles.input} />
                <TextInput placeholderTextColor='#bdbdbd' placeholder="Confirmação de senha" secureTextEntry onChangeText={(text) => handleTextInputChange('confirmacaoSenha', text)} style={styles.input} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Foto de Perfil</Text>
                <ImagePickerComponent onImagePicked={() => console.log('componente funcionando')}></ImagePickerComponent>
            </View>

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
        marginBottom: 30,
        color: '#434343'
    },
    input: {
        height: 40,
        marginBottom: 30,
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
        marginBottom: '10%'
    },
    finishButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoMessage: {
        backgroundColor: '#cfe9e5',
        padding: 20,
        marginBottom: 30,
        marginTop: '5%'
    },
    infoText: {
        textAlign: 'center',
        fontFamily: 'Roboto'
    },
    imagePicker: {
        marginBottom: 20,
        marginTop: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        width: 160,
        height: 160,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        backgroundColor: '#f0f0f0',
        alignSelf: 'center',
    },
    imagePreview: {
        width: 200,
        height: 200,
        borderRadius: 4,
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#808080',
        marginTop: 8,
        fontSize: 16,
    },
});

export default RegistrationScreen;
