import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { FIREBASE_AUTH, db } from '../../configuracao/config'; // Ensure db (Firestore) is imported
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; // Firestore methods

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const [pets, setPets] = useState([]); // State to store the list of pets

    useEffect(() => {
        const currentUser = FIREBASE_AUTH.currentUser;
        console.log('Current User:', currentUser); // Log the current user info

        if (currentUser) {
            console.log('Fetching user document from Firestore...');
            // Get user document from 'usuarios' collection using the user ID
            const userDocRef = doc(db, 'usuarios', currentUser.uid);

            getDoc(userDocRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        console.log('User data from Firestore:', userData); // Log the data fetched from Firestore

                        // Set the user state with the data from Firestore
                        setUser({
                            name: userData.nomeCompleto,
                            email: userData.email,
                            phone: userData.telefone,
                            address: `${userData.endereco}, ${userData.cidade}, ${userData.estado}`,
                            bio: `Idade: ${userData.idade}`, // Customize this as needed
                        });

                        // Set profile picture URL (if available)
                        setProfilePictureUrl(userData.imageUrl || null);
                        console.log('Profile picture URL:', userData.imageUrl);
                    } else {
                        console.log('No such user document exists!');
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching user data from Firestore:', error);
                    setLoading(false);
                });

            // Fetch the list of pets belonging to the current user
            const petsQuery = query(collection(db, 'animais'), where('ownerId', '==', currentUser.uid));
            getDocs(petsQuery)
                .then((querySnapshot) => {
                    const petsList = [];
                    querySnapshot.forEach((doc) => {
                        const petData = doc.data();
                        petsList.push({
                            id: doc.id,
                            name: petData.nome,
                            imageUrl: petData.imageUrl,
                        });
                    });
                    setPets(petsList);
                    console.log('Pets data:', petsList); // Log the fetched pets data
                })
                .catch((error) => {
                    console.error('Error fetching pets:', error);
                });
        } else {
            console.log('No user logged in.');
            setLoading(false);
        }
    }, []);

    if (loading) {
        console.log('Loading user data...');
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#88c9bf" />
                <Text style={styles.loadingText}>Carregando informações do usuário...</Text>
            </View>
        );
    }

    if (!user) {
        console.log('No user data available to display.');
        return <Text style={styles.errorText}>Nenhuma informação do usuário disponível.</Text>;
    }

    // Render each pet in a circular image with the name
    const renderPet = ({ item }) => (
        <View style={styles.petContainer}>
            <Image
                source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} // Placeholder if no image
                style={styles.petImage}
            />
            <Text style={styles.petName}>{item.name}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={
                        profilePictureUrl
                            ? { uri: profilePictureUrl }
                            : { uri: 'https://via.placeholder.com/150' } // Placeholder image if no profile picture
                    }
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Telefone:</Text>
                <Text style={styles.value}>{user.phone}</Text>

                <Text style={styles.label}>Endereço:</Text>
                <Text style={styles.value}>{user.address}</Text>

                <Text style={styles.label}>Biografia:</Text>
                <Text style={styles.value}>{user.bio}</Text>
            </View>

            {/* List of Pets for Adoption */}
            <View style={styles.petsContainer}>
                <Text style={styles.petsTitle}>Pets para Adoção:</Text>
                <FlatList
                    data={pets}
                    renderItem={renderPet}
                    keyExtractor={(item) => item.id}
                    horizontal // Display pets in a horizontal scroll
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.petsList}
                />
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#ff6b6b',
        marginTop: 20,
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
        borderWidth: 2,
        borderColor: '#88c9bf',
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
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
    },
    petsContainer: {
        marginTop: 20,
    },
    petsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    petsList: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    petContainer: {
        alignItems: 'center',
        marginRight: 15,
    },
    petImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#88c9bf',
    },
    petName: {
        marginTop: 5,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});
