import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

import {AntDesign} from '@expo/vector-icons';
import {db, FIREBASE_AUTH} from '@/config/config';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import ImagePickerComponent from "@/components/ImagePickerComponent";

interface Animal {
    [key: string]: any;
    nome: string;
    idade: 'Filhote' | 'Adulto' | 'Idoso';
    especie: 'Cachorro' | 'Gato';
    sexo: 'Macho' | 'Fêmea';
    porte: 'Pequeno' | 'Médio' | 'Grande';
    temperamento: string[];
    saude: string[];
    necessidades: string[];
    objetos: string[];
}

const AnimalRegisterScreen = () => {

    const [currentObject, setCurrentObject] = useState('');
    const [objectsList, setObjectsList] = useState<string[]>([]);

    const [dadosCadastraisDoAnimal, setDadosCadastraisDoAnimal] = useState<Animal>({
        nome: '',
        idade: 'Filhote',
        especie: 'Cachorro',
        sexo: 'Macho',
        porte: 'Pequeno',
        temperamento: [],
        saude: [],
        necessidades: [],
        objetos: [],
        responsavel: ''
    });

    const getUserEmail = (): string => {
        const user = FIREBASE_AUTH.currentUser;
        if (user && user.email) {
            console.log("Authenticated user's email:", user.email);
            return user.email;
        } else {
            console.log("No user is currently signed in or email is null.");
            return '';
        }
    }

    const addPetToFirestore = async (animal: Animal) => {
        const userEmail = getUserEmail();
        if (!userEmail) {
            console.error("No user email available, cannot add pet.");
            return;
        }

        const usuarioRef = doc(db, "usuarios", userEmail);
        const usuarioSnap = await getDoc(usuarioRef);

        if (usuarioSnap.exists()) {
            try {
                animal["responsavel"] = usuarioRef;
                const newPetRef = doc(db, 'animais', animal.nome);
                await setDoc(newPetRef, animal);
                console.log('Pet added successfully:', animal);
            } catch (error) {
                console.error('Error adding pet to Firestore:', error);
                throw error;
            }
        } else {
            console.error("User document does not exist in Firestore.");
        }
    }

    const handleAddObject = () => {
        if (currentObject.trim() !== '') {
            const updatedObjectsList = [...objectsList, currentObject.trim()];
            setObjectsList(updatedObjectsList);
            dadosCadastraisDoAnimal["objetos"] = updatedObjectsList;
            setCurrentObject('');
        }
    };

    const handleDeleteObject = (index: number) => {
        const updatedObjectsList = objectsList.filter((_, i) => i !== index);
        setObjectsList(updatedObjectsList);
        dadosCadastraisDoAnimal["objetos"] = updatedObjectsList
    };

    const renderRadioButton = (label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, formField: string, value: string) => (
        <TouchableOpacity
            onPress={() => setDadosCadastraisDoAnimal({ ...dadosCadastraisDoAnimal, [formField]: value })}
            style={styles.radioButton}
        >
            <View style={styles.radioButtonIcon}>
                {dadosCadastraisDoAnimal[formField] === value && <View style={styles.radioButtonIconInner} />}
            </View>
            <Text style={styles.radioButtonText}>{label}</Text>
        </TouchableOpacity>
    );


    const renderCheckbox = (category: string, option: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => (
        <TouchableOpacity
            onPress={() => handleCheckboxChange(category, option)}
            style={[
                styles.checkbox,
                styles.checkboxSelected && dadosCadastraisDoAnimal[category].includes(option)
            ]}
        >
            <View style={styles.checkboxIcon}>
                {dadosCadastraisDoAnimal[category].includes(option) && <View style={styles.checkboxIconInner} />}
            </View>
            <Text style={styles.checkboxText}>{option}</Text>
        </TouchableOpacity>
    );

    const handleCheckboxChange = (name: string, value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => {
        let updatedValues;
        if (dadosCadastraisDoAnimal[name].includes(value)) {
            updatedValues = dadosCadastraisDoAnimal[name].filter((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => item !== value);
        } else {
            updatedValues = [...dadosCadastraisDoAnimal[name], value];
        }
        setDadosCadastraisDoAnimal({...dadosCadastraisDoAnimal, [name]: updatedValues});
    };

    const handleFinishRegister = () => {
        console.log(dadosCadastraisDoAnimal);
        addPetToFirestore(dadosCadastraisDoAnimal).then(r =>
            () => console.log(r),
            (error) => console.log(error)
        )
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} alwaysBounceVertical={true}>
                <View style={styles.infoMessage}>
                    <Text style={styles.infoText}>As informações preenchidas serão divulgadas apenas para a pessoa com a
                        qual você realizar o processo de adoção e/ou apadrinhamento, após a formalização do
                        processo.</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações do Animal</Text>
                    <TextInput placeholderTextColor='#bdbdbd' placeholder="Nome do animal"
                               onChangeText={(text) => setDadosCadastraisDoAnimal({...dadosCadastraisDoAnimal, nome: text})} style={styles.input}/>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Foto do Animal</Text>
                        <ImagePickerComponent onImagePicked={() => console.log('compoenente funcionando')}></ImagePickerComponent>
                    </View>

                    <Text style={styles.label}>Idade</Text>
                    <View style={styles.radioButtonGroup}>
                        {renderRadioButton('Filhote', 'idade', 'Filhote')}
                        {renderRadioButton('Adulto', 'idade', 'Adulto')}
                        {renderRadioButton('Idoso', 'idade', 'Idoso')}
                    </View>

                    <Text style={styles.label}>Espécie</Text>
                    <View style={styles.radioButtonGroup}>
                        {renderRadioButton('Cachorro', 'especie', 'Cachorro')}
                        {renderRadioButton('Gato', 'especie', 'Gato')}
                    </View>

                    <Text style={styles.label}>Sexo</Text>
                    <View style={styles.radioButtonGroup}>
                        {renderRadioButton('Macho', 'sexo', 'Macho')}
                        {renderRadioButton('Fêmea', 'sexo', 'Fêmea')}
                    </View>

                    <Text style={styles.label}>Porte</Text>
                    <View style={styles.radioButtonGroup}>
                        {renderRadioButton('Pequeno', 'porte', 'Pequeno')}
                        {renderRadioButton('Médio', 'porte', 'Médio')}
                        {renderRadioButton('Grande', 'porte', 'Grande')}
                    </View>

                    <Text style={styles.label}>Temperamento</Text>
                    <View style={styles.checkboxGroup}>
                        {renderCheckbox('temperamento', 'Brincalhão')}
                        {renderCheckbox('temperamento', 'Tímido')}
                        {renderCheckbox('temperamento', 'Calmo')}
                        {renderCheckbox('temperamento', 'Guarda')}
                        {renderCheckbox('temperamento', 'Amoroso')}
                        {renderCheckbox('temperamento', 'Preguiçoso')}
                    </View>

                    <Text style={styles.label}>Saúde</Text>
                    <View style={styles.checkboxGroup}>
                        {renderCheckbox('saude', 'Vacinado')}
                        {renderCheckbox('saude', 'Vermifugado')}
                        {renderCheckbox('saude', 'Castrado')}
                        {renderCheckbox('saude', 'Doente')}
                    </View>

                    <Text style={styles.label}>Necessidades</Text>
                    <View style={styles.checkboxGroup}>
                        {renderCheckbox('necessidades', 'Alimento')}
                        {renderCheckbox('necessidades', 'Auxílio Financeiro')}
                        {renderCheckbox('necessidades', 'Medicamento')}
                    </View>

                    <Text style={styles.label}>Objetos</Text>
                    <TextInput
                        placeholderTextColor='#bdbdbd'
                        placeholder="Adicione um objeto"
                        value={currentObject}
                        onChangeText={setCurrentObject}
                        onSubmitEditing={handleAddObject} // This allows users to add items by pressing the return key on the keyboard
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={handleAddObject} style={styles.button}>
                        <Text style={styles.buttonText}>Adicionar objeto</Text>
                    </TouchableOpacity>

                    {objectsList.map((object, index) => (
                        <View key={index} style={styles.objectItem}>
                            <Text style={styles.objectText}>{object}</Text>
                            <TouchableOpacity onPress={() => handleDeleteObject(index)} style={styles.deleteButton}>
                                <AntDesign name="delete" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <TouchableOpacity onPress={handleFinishRegister} style={styles.finishButton}>
                    <Text style={styles.finishButtonText}>Procurar ajuda</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#5E72E4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    objectItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginVertical: 5,
        padding: 10,
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowColor: '#000',
        shadowOffset: { height: 1, width: 1 },
        elevation: 1,
    },
    objectText: {
        flex: 1,
        marginLeft: 10,
    },
    deleteButton: {
        backgroundColor: '#f52121',
        padding: 5,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    infoMessage: {
        backgroundColor: '#e0f2f1',
        padding: 16,
        margin: 16,
        borderRadius: 10,
        marginBottom: 20,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowColor: '#000',
        shadowOffset: { height: 3, width: 3 },
        elevation: 2,
    },
    infoText: {
        color: '#434343',
        fontSize: 14,
    },
    section: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginHorizontal: 16,
        marginBottom: 20,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowColor: '#000',
        shadowOffset: { height: 3, width: 3 },
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#434343',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 0,
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 20,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowColor: '#000',
        shadowOffset: { height: 2, width: 2 },
        elevation: 1,
    },
    label: {
        fontSize: 16,
        color: '#434343',
        marginBottom: 8,
        marginLeft: 16,
    },
    radioButtonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    radioButton: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
    },
    radioButtonIcon: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#88c9bf',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioButtonIconInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#88c9bf',
    },
    radioButtonText: {
        fontSize: 16,
        color: '#434343',
    },
    finishButton: {
        backgroundColor: '#88c9bf',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 32,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowColor: '#000',
        shadowOffset: { height: 2, width: 2 },
        elevation: 1,
    },
    finishButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    checkboxGroup: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        marginHorizontal: 16,
        marginBottom: 20,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 5,
        marginTop: 15
    },
    checkboxIcon: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#88c9bf',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkboxIconInner: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#88c9bf',
    },
    checkboxText: {
        fontSize: 16,
        color: '#434343',
    },
    checkboxSelected: {
        backgroundColor: '#88c9bf',
        borderColor: '#88c9bf',
    },
});

export default AnimalRegisterScreen;

