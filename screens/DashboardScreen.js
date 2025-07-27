import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Platform,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getInventoryItems } from '../utils/api';
import ItemCard from '../components/ItemCard';

const { width, height } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async () => {
    try {
      const data = await getInventoryItems();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu-outline" size={28} color="#f8c200"  style={{ marginTop: 50 }}  />
          </TouchableOpacity>

          <Text style={styles.title}>Dashboard</Text>

          <View style={styles.icons}>
            <Ionicons name="notifications-outline" size={24} color="#f8c200" style={styles.icon} onPress={() => navigation.navigate('Notification')}/>
            <Ionicons name="person-outline" size={24} color="#f8c200" style={styles.icon} />
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#969393ff" />
          <TextInput
            placeholder="Search Items"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
          />
        </View>

        {/* TAGLINE */}
        <Text style={styles.tagline}>
          Borrow things through <Text style={styles.brand}>TrailLend</Text>
        </Text>

        {/* ITEM LIST TITLE */}
        <Text style={styles.listTitle}>List Of Items</Text>

        {/* LOADING / EMPTY STATE */}
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} />
        ) : filteredItems.length === 0 ? (
          <Text style={styles.emptyMessage}>No items available yet.</Text>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => <ItemCard item={item} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1F1B4F', // ✅ BG COLOR
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginBottom: 15,
  },
  icons: {
    flexDirection: 'row',
    marginTop: 50,
  },
  icon: {
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: width * 0.025,
    borderWidth: 1,
    borderRadius: 50, // ✅ Rounded input
    marginVertical: height * 0.02,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: width * 0.04,
    color: '#000',
  },
  tagline: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#fff',
  },
  brand: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#f8c200',
  },
  listTitle: {
    marginTop: height * 0.03,
    fontWeight: '600',
    fontSize: width * 0.045,
    color: '#fff',
    marginBottom: 10,
  },
  emptyMessage: {
    marginTop: 10,
    color: '#ccc',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
});
