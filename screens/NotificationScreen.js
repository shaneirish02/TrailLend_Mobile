import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('access');
      if (!token) return;

      const res = await fetch('http://192.168.226.115:8000/api/notifications/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

  

      const data = await res.json();
      console.log('📦 Fetched notification data:', data);
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.verb}>{item.verb}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={16} color="#f8c200" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>

        {/* 🔁 Refresh Button */}
        <TouchableOpacity onPress={onRefresh} style={styles.refreshIcon}>
          <Ionicons name="refresh" size={20} color="#f8c200" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      {loading ? (
        <ActivityIndicator size="large" color="#f8c200" />
      ) : notifications.length === 0 ? (
        <Text style={styles.noNotif}>No new notifications.</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a6b',
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backIcon: {
    borderColor: '#f8c200',
    borderWidth: 2,
    borderRadius: 16,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 30,
  },
  refreshIcon: {
    borderColor: '#f8c200',
    borderWidth: 2,
    borderRadius: 16,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noNotif: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  notificationItem: {
    backgroundColor: '#2c2c85',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  verb: {
    color: '#f8c200',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: 'white',
    fontSize: 15,
  },
  timestamp: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
  },
});
