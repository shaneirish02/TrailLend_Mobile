import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ItemCard({ item }) {
  const navigation = useNavigation();

  const imageUrl = item.image?.startsWith('http')
    ? item.image
    : `http://192.168.226.115:8000${item.image}`; // 🔁 Replace with your IP

  const displayFee =
    item.payment_type === 'custom'
      ? `₱${parseFloat(item.custom_price).toFixed(2)}`
      : 'Free';

  const handlePress = () => {
    navigation.navigate('ItemDetails', { item });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.name}>{item.name || 'No Name'}</Text>
      <Text style={styles.fee}>Fee: {displayFee}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.43,
    backgroundColor: '#fff',
    padding: 10,
    margin: width * 0.02,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f4f4f4',
  },
  name: {
    fontSize: width * 0.04,
    fontWeight: '600',
    textAlign: 'center',
  },
  fee: {
    fontSize: width * 0.035,
    color: '#888',
    marginTop: 5,
  },
});
