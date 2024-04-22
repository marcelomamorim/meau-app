import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import ImagePickerComponent from "@/components/ImagePickerComponent";

interface FormData {
    [key: string]: any;
    nome: string;
    idade: 'Filhote' | 'Adulto' | 'Idoso';
    especie: 'Cachorro' | 'Gato';
    sexo: 'Macho' | 'Fêmea';
    porte: 'Pequeno' | 'Médio' | 'Grande';
    temperamento: string[];
    saude: string[];
    necessidades: string[];
    objetos: string;
}

const AnimalRegisterScreen = () => {

    const [formData, setFormData] = useState<FormData>({
        nome: '',
        idade: 'Filhote',
        especie: 'Cachorro',
        sexo: 'Macho',
        porte: 'Pequeno',
        temperamento: [],
        saude: [],
        necessidades: [],
        objetos: '',
    });


    const renderRadioButton = (label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, formField: string, value: string) => (
        <TouchableOpacity
            onPress={() => setFormData({ ...formData, [formField]: value })}
            style={styles.radioButton}
        >
            <View style={styles.radioButtonIcon}>
                {formData[formField] === value && <View style={styles.radioButtonIconInner} />}
            </View>
            <Text style={styles.radioButtonText}>{label}</Text>
        </TouchableOpacity>
    );


    const renderCheckbox = (category: string, option: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => (
        <TouchableOpacity
            onPress={() => handleCheckboxChange(category, option)}
            style={[
                styles.checkbox,
                styles.checkboxSelected && formData[category].includes(option)
            ]}
        >
            <View style={styles.checkboxIcon}>
                {formData[category].includes(option) && <View style={styles.checkboxIconInner} />}
            </View>
            <Text style={styles.checkboxText}>{option}</Text>
        </TouchableOpacity>
    );

    const handleCheckboxChange = (name: string, value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => {
        let updatedValues;
        if (formData[name].includes(value)) {
            updatedValues = formData[name].filter((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => item !== value);
        } else {
            updatedValues = [...formData[name], value];
        }
        setFormData({...formData, [name]: updatedValues});
    };

    const handleFinishRegister = () => {
        console.log(formData);
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
                               onChangeText={(text) => setFormData({...formData, nome: text})} style={styles.input}/>

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

                    {/* Objetos */}
                    <TextInput placeholderTextColor='#bdbdbd' placeholder="Objetos"
                               onChangeText={(text) => setFormData({...formData, objetos: text})} style={styles.input}/>
                </View>

                <TouchableOpacity onPress={handleFinishRegister} style={styles.finishButton}>
                    <Text style={styles.finishButtonText}>Finalizar Cadastro</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
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

