import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const ReservationStatus = ({ route }) => {
  const { userId } = route.params;
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Upcoming');

  useFocusEffect(
    React.useCallback(() => {
      fetchReservations();
    }, [])
  );

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        `http://<your-ip>:8000/api/reservations/user/${userId}/`
      );
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.post(`http://192.168.46.115:8000/api/reservations/${id}/cancel/`);
      fetchReservations(); // Refresh list
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const status = reservation.status.toLowerCase();

    if (filter === 'Upcoming') {
      return status === 'reserved';
    } else if (filter === 'Past') {
      return (
        status === 'completed' ||
        status === 'no_show' ||
        status === 'overdue' ||
        status === 'returned'
      );
    } else if (filter === 'Cancelled') {
      return status === 'cancelled';
    }

    return true;
  });

  const getStatusBadge = (status) => {
    const colorMap = {
      reserved: '#32CD32',
      completed: '#1E90FF',
      no_show: '#A9A9A9',
      overdue: '#FF8C00',
      returned: '#2E8B57',
      cancelled: '#DC143C',
    };

    return (
      <View style={[styles.statusBadge, { backgroundColor: colorMap[status.toLowerCase()] || '#ccc' }]}>
        <Text style={styles.statusText}>{status.toUpperCase()}</Text>
      </View>
    );
  };

  const renderReservation = ({ item: reservation }) => {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: `http://<your-ip>:8000${reservation.item.image}` }}
          style={styles.image}
        />

        <View style={styles.details}>
          <Text style={styles.itemName}>{reservation.item.name}</Text>
          <Text style={styles.location}>{reservation.item.location}</Text>

          <Text style={styles.transactionId}>
            Transaction ID: {reservation.transaction_id || 'N/A'}
          </Text>

          {reservation.status.toLowerCase() === 'reserved' && (
            <TouchableOpacity onPress={() => handleCancel(reservation.id)}>
              <Text style={styles.cancelButton}>✘ Cancel Reservation</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.rightSection}>
          {getStatusBadge(reservation.status)}

          <Text style={styles.dateText}>
            {new Date(reservation.date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <Text style={styles.timeText}>
            {reservation.start_time} - {reservation.end_time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.tabs}>
        {['Upcoming', 'Past', 'Cancelled'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              filter === tab && styles.activeTabButton,
            ]}
            onPress={() => setFilter(tab)}
          >
            <Text
              style={[
                styles.tabText,
                filter === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={filteredReservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReservation}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No reservations found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  activeTabButton: {
    backgroundColor: '#333',
  },
  tabText: { color: '#333', fontWeight: 'bold' },
  activeTabText: { color: '#fff' },

  card: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  details: { flex: 1, justifyContent: 'center' },
  itemName: { fontWeight: 'bold', fontSize: 16 },
  location: { color: '#666', marginVertical: 2 },
  transactionId: { fontSize: 12, color: '#444' },
  cancelButton: {
    color: '#DC143C',
    fontSize: 13,
    marginTop: 4,
    fontWeight: 'bold',
  },

  rightSection: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dateText: { fontSize: 13, marginTop: 4 },
  timeText: { fontSize: 13, color: '#666' },
  list: { paddingBottom: 20 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#aaa' },
});

export default ReservationStatus;
