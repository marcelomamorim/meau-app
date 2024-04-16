import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from "@expo/vector-icons";

const AnimalRegisterScreen = () => {

    const [formData, setFormData] = useState({
        nome: '',
        idade: '',
        especie: '',
        sexo: '',
        porte: '',
        temperamento: [],
        saude: [],
        necessidades: [],
        objetos: '',
    });

    const [image, setImage] = useState(null);

    useEffect(() => {
        requestMediaLibraryPermissions().then(() => {
            console.log('Permissao solicitada!')
        });
    }, []);

    const requestMediaLibraryPermissions = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Sorry, we need media library permissions to make this work!');
            }
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const handleCheckboxChange = (name, value) => {
        let updatedValues;
        if (formData[name].includes(value)) {
            updatedValues = formData[name].filter(item => item !== value);
        } else {
            updatedValues = [...formData[name], value];
        }
        setFormData({ ...formData, [name]: updatedValues });
    };

    const handleFinishRegister = () => {
        console.log(formData);
        console.log(image);
    };

    return (
        <View style={styles.centeredContainer}>
            <ScrollView style={styles.container} alwaysBounceVertical={true}>
                <View style={styles.infoMessage}>
                    <Text style={styles.infoText}>As informações preenchidas serão divulgadas apenas para a pessoa com a qual você realizar o processo de adoção e/ou apadrinhamento, após a formalização do processo.</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações do Animal</Text>
                    <TextInput placeholderTextColor='#bdbdbd' placeholder="Nome do animal" onChangeText={(text) => setFormData({ ...formData, nome: text })} style={styles.input} />

                    <Text style={styles.label}>Idade</Text>
                    {/* Opções de idade */}
                    <View style={styles.radioButtonGroup}>
                        <TouchableOpacity onPress={() => setFormData({ ...formData, idade: 'Filhote' })} style={[styles.radioButton, formData.idade === 'Filhote' && styles.radioButtonSelected]}>
                            <Text style={styles.radioButtonText}>Filhote</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setFormData({ ...formData, idade: 'Adulto' })} style={[styles.radioButton, formData.idade === 'Adulto' && styles.radioButtonSelected]}>
                            <Text style={styles.radioButtonText}>Adulto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setFormData({ ...formData, idade: 'Idoso' })} style={[styles.radioButton, formData.idade === 'Idoso' && styles.radioButtonSelected]}>
                            <Text style={styles.radioButtonText}>Idoso</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Outros campos de seleção múltipla */}
                    <Text style={styles.label}>Espécie</Text>
                    <View style={styles.radioButtonGroup}>
                        <TouchableOpacity onPress={() => setFormData({ ...formData, especie: 'Cachorro' })} style={[styles.radioButton, formData.especie === 'Cachorro' && styles.radioButtonSelected]}>
                            <Text style={styles.radioButtonText}>Cachorro</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setFormData({ ...formData, especie: 'Gato' })} style={[styles.radioButton, formData.especie === 'Gato' && styles.radioButtonSelected]}>
                            <Text style={styles.radioButtonText}>Gato</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sexo */}
                    <Text style={styles.label}>Sexo</Text>
                    <View style={styles.radioButtonGroup}>
                        <TouchableOpacity onPress={() => setFormData({ ...formData, sexo: 'Macho' })} style={[styles.radioButton, formData.sexo === 'Macho' && styles.radioButtonSelected]}>
                            <Text style={styles.radioButtonText}>Macho</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setFormData({ ...formData, sexo: 'Fêmea' })} style={[styles.radioButton, formData.sexo === 'Fêmea' && styles.radioButtonSelected]}>
                            <Text style={styles.radioButtonText}>Fêmea</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Porte */}
                    <Text style={styles.label}>Porte</Text>
                    <View style={styles.radioButtonGroup}>
                        <TouchableOpacity onPress={() => setFormData({ ...formData, porte: 'Pequeno' })} style={[styles.radioButton, formData.porte === 'Pequeno' && styles.radioButtonSelected]}>
                            <Text style={styles.radioButtonText}>Pequeno</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setFormData({ ...formData, porte: 'Médio' })} style={[styles.radioButton, formData.porte === 'Médio' && styles.radioButtonSelected]}>
                            <Text style={styles.radioButtonText}>Médio</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setFormData({ ...formData, porte: 'Grande' })} style={[styles.radioButton, formData.porte === 'Grande' && styles.radioButtonSelected]}>
                            <Text style={styles.radioButtonText}>Grande</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Temperamento */}
                    <Text style={styles.label}>Temperamento</Text>
                    <View style={styles.checkboxGroup}>
                        <TouchableOpacity onPress={() => handleCheckboxChange('temperamento', 'Brincalhão')} style={[styles.checkbox, formData.temperamento.includes('Brincalhão') && styles.checkboxSelected]}>
                            <Text style={styles.checkboxText}>Brincalhão</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCheckboxChange('temperamento', 'Tímido')} style={[styles.checkbox, formData.temperamento.includes('Tímido') && styles.checkboxSelected]}>
                            <Text style={styles.checkboxText}>Tímido</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCheckboxChange('temperamento', 'Calmo')} style={[styles.checkbox, formData.temperamento.includes('Calmo') && styles.checkboxSelected]}>
                            <Text style={styles.checkboxText}>Calmo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCheckboxChange('temperamento', 'Guarda')} style={[styles.checkbox, formData.temperamento.includes('Guarda') && styles.checkboxSelected]}>
                            <Text style={styles.checkboxText}>Guarda</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCheckboxChange('temperamento', 'Amoroso')} style={[styles.checkbox, formData.temperamento.includes('Amoroso') && styles.checkboxSelected]}>
                            <Text style={styles.checkboxText}>Amoroso</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCheckboxChange('temperamento', 'Preguiçoso')} style={[styles.checkbox, formData.temperamento.includes('Preguiçoso') && styles.checkboxSelected]}>
                            <Text style={styles.checkboxText}>Preguiçoso</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Saúde */}
                    <Text style={styles.label}>Saúde</Text>
                    <View style={styles.checkboxGroup}>
                        <TouchableOpacity onPress={() => handleCheckboxChange('saude', 'Vacinado')} style={[styles.checkbox, formData.saude.includes('Vacinado') && styles.checkboxSelected]}>
                            <Text style={styles.checkboxText}>Vacinado</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCheckboxChange('saude', 'Vermifugado')} style={[styles.checkbox, formData.saude.includes('Vermifugado') && styles.checkboxSelected]}>
                            <Text style={styles.checkboxText}>Vermifugado</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCheckboxChange('saude', 'Castrado')} style={[styles.checkbox, formData.saude.includes('Castrado') && styles.checkboxSelected]}>
                            <Text style={styles.checkboxText}>Castrado</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCheckboxChange('saude', 'Doente')} style={[styles.checkbox, formData.saude.includes('Doente') && styles.checkboxSelected]}>
                            <Text style={styles.checkboxText}>Doente</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Necessidades */}
                    <Text style={styles.label}>Necessidades</Text>
                    <View style={styles.checkboxGroup}>
                        <TouchableOpacity onPress={() => handleCheckboxChange('necessidades', 'Alimento')} style={[styles.checkbox, formData.necessidades.includes('Alimento') && styles.checkboxSelected]}>
                            <Text style={styles.checkboxText}>Alimento</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCheckboxChange('necessidades', 'Auxílio Financeiro')} style={[styles.checkbox, formData.necessidades.includes('Auxílio Financeiro') && styles.checkboxSelected]}>
                            <Text style={styles.checkboxText}>Auxílio Financeiro</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCheckboxChange('necessidades', 'Medicamento')} style={[styles.checkbox, formData.necessidades.includes('Medicamento') && styles.checkboxSelected]}>
                            <Text style={styles.checkboxText}>Medicamento</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Objetos */}
                    <TextInput placeholderTextColor='#bdbdbd' placeholder="Objetos" onChangeText={(text) => setFormData({ ...formData, objetos: text })} style={styles.input} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Foto do Animal</Text>
                    <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.imagePreview} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <MaterialIcons name="camera-alt" size={40} color="#808080" />
                                <Text style={styles.placeholderText}>Selecione uma foto</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleFinishRegister} style={styles.finishButton}>
                    <Text style={styles.finishButtonText}>Finalizar Cadastro</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '100%',
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
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#434343'
    },
    radioButtonGroup: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    radioButtonSelected: {
        backgroundColor: '#cfe9e5',
        padding: 8,
        borderRadius: 5,
    },
    radioButtonText: {
        color: '#434343',
        fontSize: 14,
        marginLeft: 5,
    },
    checkboxGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    checkboxSelected: {
        backgroundColor: '#cfe9e5',
        borderWidth: 1,
        borderColor: '#88c9bf',
    },
    checkboxText: {
        color: '#434343',
        fontSize: 14,
        marginLeft: 5,
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
        marginTop: 10
    },
    infoText: {
        textAlign: 'center',
        fontFamily: 'Roboto'
    },
    imagePicker: {
        marginBottom: 20,
        marginTop: 10,
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

export default AnimalRegisterScreen;
