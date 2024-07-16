import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { collection, getDocs, query, orderBy, startAfter, limit, DocumentSnapshot } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '@/config/config';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

interface Animal {
  id: string;
  nome: string;
  sexo: string;
  idade: string;
  porte: string;
  location: string;
  imageUrl?: string;
  especie: string;
  temperamento: string[];
  saude: string[];
  necessidades: string[];
  objetos: string[];
}

const AdotarFeed = () => {
  const [pets, setPets] = useState<Animal[]>([]);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPets, setLikedPets] = useState<{ [key: string]: boolean }>({});

  const navigation = useNavigation();

  const callCount = useRef(0);
  const callCountTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchPets = useCallback(async (isRefresh: boolean = false) => {
    if (loading || callCount.current >= 3) return;

    setLoading(true);
    callCount.current += 1;

    if (!callCountTimeout.current) {
      callCountTimeout.current = setTimeout(() => {
        callCount.current = 0;
        callCountTimeout.current = null;
      }, 10000); // Reset call count every 10 seconds
    }

    try {
      const petsQuery = isRefresh
        ? query(collection(db, 'animais'), orderBy('nome'), limit(3))
        : query(collection(db, 'animais'), orderBy('nome'), limit(3), startAfter(lastVisible));

      const querySnapshot = await getDocs(petsQuery);

      if (!querySnapshot.empty) {
        const newPets: Animal[] = [];
        for (const docSnapshot of querySnapshot.docs) {
          const petData = docSnapshot.data();

          try {
            const imageUrl = await getDownloadURL(ref(storage, `images/${petData.nome}.jpg`));
            newPets.push({ ...petData, id: docSnapshot.id, imageUrl } as Animal);
          } catch (imageError) {
            console.error('Error fetching image for:', petData.nome, imageError);
          }
        }
        setPets(isRefresh ? newPets : [...pets, ...newPets]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else if (isRefresh) {
        setPets([]);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [lastVisible, loading]);

  useFocusEffect(
    useCallback(() => {
      const fetchInitialPets = async () => {
        setLastVisible(null);
        await fetchPets(true);
      };
      fetchInitialPets();
    }, [fetchPets])
  );

  const handleHeartPress = (id: string) => {
    setLikedPets((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleAnimalPress = (animal: Animal) => {
    navigation.navigate('profile-animal', { animal });
  };

  const renderItem = ({ item }: { item: Animal }) => (
    <TouchableOpacity onPress={() => handleAnimalPress(item)} style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.nome}</Text>
        <TouchableOpacity style={styles.heartButton} onPress={() => handleHeartPress(item.id)}>
          <FontAwesome
            name={likedPets[item.id] ? "heart" : "heart-o"}
            size={24}
            color={likedPets[item.id] ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>{item.sexo}</Text>
        <Text style={styles.detail}>{item.idade}</Text>
        <Text style={styles.detail}>{item.porte}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    if (!loading && lastVisible) {
      fetchPets();
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setLastVisible(null);
    fetchPets(true);
  };

  return (
    <FlatList
      data={pets}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
      refreshing={refreshing}
      onRefresh={handleRefresh}
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
    height: 200,
    resizeMode: 'cover',
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
