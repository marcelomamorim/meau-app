import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { FIREBASE_AUTH } from '../../configuracao/config'; // Certifique-se de que o caminho está correto

export default function UserProfile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = FIREBASE_AUTH.currentUser;

        if (currentUser) {
            setUser({
                name: currentUser.displayName,
                email: currentUser.email,
                photoURL: currentUser.photoURL,
                age: '25', // Pode ser obtido de outra fonte, como o Firestore
                address: 'Rua Exemplo, 123', // Pode ser obtido de outra fonte também
            });
        }
    }, []);

    if (!user) {
        return <Text>Carregando informações do usuário...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileContainer}>
                <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Idade:</Text>
                <Text style={styles.value}>{user.age}</Text>

                <Text style={styles.label}>Endereço:</Text>
                <Text style={styles.value}>{user.address}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 20,
    },
    profileContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    infoContainer: {
        marginVertical: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    value: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
});
