import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

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
  const [liked, setLiked] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  const handleAdoptClick = () => {
    let chatData = { chatId: null, animalId: animal.id, ownerId: animal.ownerId };
    console.log(chatData);
    navigation.navigate('chat', chatData);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: animal.imageUrl }} style={[styles.image, { width: screenWidth - 30 }]} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{animal.nome}</Text>
        <TouchableOpacity style={styles.heartButton} onPress={toggleLike}>
          <FontAwesome name={liked ? "heart" : "heart-o"} size={24} color={liked ? "red" : "black"} />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>sexo</Text>
        <Text style={styles.detail}>{animal.sexo}</Text>

        <Text style={styles.label}>porte</Text>
        <Text style={styles.detail}>{animal.porte}</Text>

        <Text style={styles.label}>idade</Text>
        <Text style={styles.detail}>{animal.idade}</Text>

        <Text style={styles.label}>localização</Text>
        <Text style={styles.detail}>{animal.location}</Text>

        <Text style={styles.label}>temperamento</Text>
        <Text style={styles.detail}>{animal.temperamento.join(', ')}</Text>

        <Text style={styles.label}>saúde</Text>
        <Text style={styles.detail}>{animal.saude.join(', ')}</Text>

        <Text style={styles.label}>necessidades</Text>
        <Text style={styles.detail}>{animal.necessidades.join(', ')}</Text>

        <Text style={styles.label}>objetos</Text>
        <Text style={styles.detail}>{animal.objetos.join(', ')}</Text>
      </View>

      <TouchableOpacity style={styles.adoptButton} onPress={handleAdoptClick}>
        <Text style={styles.adoptButtonText}>pretendo adotar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  image: {
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
    margin: 15,
    borderWidth: 2, // Added a defined border
    borderColor: '#FFD700',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Roboto_700Bold',
    color: '#000',
  },
  heartButton: {
    padding: 10,
  },
  detailsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    color: '#FFD700',
    marginTop: 10,
    textTransform: 'lowercase', // Lowercased the titles
  },
  detail: {
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
    color: '#434343',
    marginBottom: 10,
  },
  adoptButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    margin: 20,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  adoptButtonText: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    color: '#FFFFFF',
  },
});

export default DetailedAnimalScreen;
