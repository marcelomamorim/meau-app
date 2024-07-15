// AdotarFeed.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const pets = [
  {
    id: '1',
    name: 'Pequi',
    gender: 'MACHO',
    age: 'ADULTO',
    size: 'MÉDIO',
    location: 'SAMAMBAIA SUL - DISTRITO FEDERAL',
    image: 'https://tudosobrecachorros.com.br/wp-content/uploads/american-bully-1.jpg',
  },
  {
    id: '2',
    name: 'Bidu',
    gender: 'MACHO',
    age: 'ADULTO',
    size: 'MÉDIO',
    location: 'SAMAMBAIA SUL - DISTRITO FEDERAL',
    image: 'https://www.thesprucepets.com/thmb/7yH0zRjVxd6Zb0BfNc6f0pJnvac=/2338x0/filters:no_upscale():strip_icc()/cute-dog-breeds-we-can-t-get-enough-of-4589340-18-d7d08269a41249d180fd1e0a249c6fcb.jpg',
  },
  {
    id: '3',
    name: 'Alec',
    gender: 'MACHO',
    age: 'ADULTO',
    size: 'MÉDIO',
    location: 'SAMAMBAIA SUL - DISTRITO FEDERAL',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrEnoCklbl3CLcgejnzeA_94fduRCO_DtZxw&s',
  },
];

const AdotarFeed = () => {
  const renderItem = ({ item }: { item: typeof pets[0] }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity style={styles.heartButton}>
          <FontAwesome name="heart-o" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>{item.gender}</Text>
        <Text style={styles.detail}>{item.age}</Text>
        <Text style={styles.detail}>{item.size}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={pets}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9, // Adjust the aspect ratio as needed
    resizeMode: 'cover', // Ensures the image covers the area while maintaining aspect ratio
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFD700',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  heartButton: {
    alignSelf: 'flex-end',
  },
  detailsContainer: {
    padding: 10,
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  location: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AdotarFeed;
