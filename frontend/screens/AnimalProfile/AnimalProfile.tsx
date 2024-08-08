import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { db } from '@/configuracao/config';
import { collection, doc } from 'firebase/firestore';

type Animal = {
  id: string;
  imageUrl: string;
  nome: string;
  sexo: string;
  porte: string;
  idade: string;
  location: string;
  temperamento: string[];
  saude: string[];
  necessidades: string[];
  objetos: string[];
  ownerId: string;
};

type DetailedAnimalScreenRouteProp = RouteProp<{ params: { animal: Animal } }, 'params'>;

const DetailedAnimalScreen: React.FC = () => {
  const route = useRoute<DetailedAnimalScreenRouteProp>();
  const navigation = useNavigation();
  const { animal } = route.params;

  const handleAdoptClick = () => {
    let chatData = { chatId: null, animalId: animal.id, ownerId: animal.ownerId };
    console.log(chatData);
    navigation.navigate('chat', chatData);
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

        <TouchableOpacity style={styles.adoptButton} onPress={handleAdoptClick}>
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
    height: 250,
    resizeMode: 'cover',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFD700',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  heartButton: {
    padding: 10,
  },
  detailsContainer: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 10,
  },
  detail: {
    fontSize: 16,
    color: '#434343',
    marginBottom: 10,
  },
  adoptButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    margin: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  adoptButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default DetailedAnimalScreen;
