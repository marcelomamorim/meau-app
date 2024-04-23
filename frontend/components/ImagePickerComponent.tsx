import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, View, Text, Alert, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from "@expo/vector-icons";

interface ImagePickerProps {
    onImagePicked: (uri: string | null) => void;
}

const ImagePickerComponent: React.FC<ImagePickerProps> = ({ onImagePicked }) => {

    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        requestMediaLibraryPermissions().then(r => console.log('Permissao solicitada para selecionar imagem.'));
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

        if (!result.canceled && result.assets) {
            setImage(result.assets[0].uri);
            onImagePicked(result.assets[0].uri);
        }
    };

    return (
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
    );
};

const styles = StyleSheet.create({
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

export default ImagePickerComponent;
