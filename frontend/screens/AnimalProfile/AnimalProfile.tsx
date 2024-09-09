import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { db, FIREBASE_AUTH } from '@/configuracao/config';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const DetailedAnimalScreen = () => {

  const route = useRoute();
  const { animal } = route.params;

  const handleAdoptPress = async () => {
    try {
      // Cria uma entrada na coleção "adoptionInterests" no Firestore
      await addDoc(collection(db, 'adoptionInterests'), {
        interestedUserId: FIREBASE_AUTH.currentUser?.uid,  // ID do usuário interessado (você pode obter isso do contexto ou estado global)
        animalId: animal.id,         // ID do animal
        ownerId: animal.ownerId,     // ID do dono do animal
        timestamp: new Date().toISOString(), // Data e hora do interesse
      });

      // Mostra uma mensagem de confirmação para o usuário interessado
      Alert.alert("Interesse registrado", "Seu interesse foi registrado, aguarde o contato com o dono do animal.");

    } catch (error) {
      console.error("Erro ao registrar interesse na adoção: ", error);
      Alert.alert("Erro", "Não foi possível registrar seu interesse. Por favor, tente novamente.");
    }
  };

  return (
      <ScrollView style={styles.container}>
        <Image source={{ uri: animal.imageUrl }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{animal.nome}</Text>
          <TouchableOpacity style={styles.heartButton}>
            <FontAwesome name="heart-o" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>SEXO</Text>
          <Text style={styles.detail}>{animal.sexo}</Text>

          <Text style={styles.label}>PORTE</Text>
          <Text style={styles.detail}>{animal.porte}</Text>

          <Text style={styles.label}>IDADE</Text>
          <Text style={styles.detail}>{animal.idade}</Text>

          <Text style={styles.label}>LOCALIZAÇÃO</Text>
          <Text style={styles.detail}>{animal.location}</Text>

          <Text style={styles.label}>TEMPERAMENTO</Text>
          <Text style={styles.detail}>{animal.temperamento.join(', ')}</Text>

          <Text style={styles.label}>SAÚDE</Text>
          <Text style={styles.detail}>{animal.saude.join(', ')}</Text>

          <Text style={styles.label}>NECESSIDADES</Text>
          <Text style={styles.detail}>{animal.necessidades.join(', ')}</Text>

          <Text style={styles.label}>OBJETOS</Text>
          <Text style={styles.detail}>{animal.objetos.join(', ')}</Text>
        </View>

        <TouchableOpacity style={styles.adoptButton} onPress={handleAdoptPress}>
          <Text style={styles.adoptButtonText}>PRETENDO ADOTAR</Text>
        </TouchableOpacity>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 300,
  },
  infoContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  heartButton: {
    padding: 10,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detail: {
    fontSize: 16,
    marginTop: 5,
  },
  adoptButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 5,
  },
  adoptButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DetailedAnimalScreen;
