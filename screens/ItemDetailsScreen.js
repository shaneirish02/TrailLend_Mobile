import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CalendarModal from '../components/CalendarModal';

const { width } = Dimensions.get('window');

export default function ItemDetailsScreen({ route }) {
  const { item } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [reserveDate, setReserveDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const imageUrl = item.image?.startsWith('http')
    ? item.image
    : `http://192.168.226.115:8000${item.image}`;

  const displayFee =
    item.payment_type === 'custom'
      ? `₱${parseFloat(item.custom_price).toFixed(2)}`
      : 'Free';

  const formatToReadable = (isoString) => {
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = ((hours + 11) % 12) + 1;
    return `${yyyy}-${mm}-${dd} ${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={16} color="#f8c200" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Item</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.label}>Department Owner</Text>
            <Text style={styles.department}>{item.department || 'IT Department'}</Text>
            <View style={{ height: 6 }} />
            <Text style={styles.label}>Availability</Text>
            <Text style={styles.availability}>
              <Text style={styles.availableText}>Available</Text>
            </Text>
          </View>

          <View style={styles.infoRight}>
            <Text style={styles.feeLabel}>Fee:</Text>
            <Text style={styles.feeValue}>{displayFee}</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Details:</Text>
          <Text style={styles.detailsDescription}>{item.description || 'No additional description.'}</Text>
          <Text style={styles.note}>note: Tap icon to Reserve Date and Time</Text>
        </View>

        <View style={styles.reservationRow}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.calendarIconBox}>
            <Ionicons name="calendar-outline" size={30} color="white" />
          </TouchableOpacity>

          <View style={styles.dateFields}>
            <Text style={styles.inputLabel}>Reserve:</Text>
            <TextInput
              style={styles.dateInput}
              value={reserveDate ? formatToReadable(reserveDate) : ''}
              editable={false}
              placeholder="Select Date"
            />
            <Text style={styles.inputLabel}>Returned:</Text>
            <TextInput
              style={styles.dateInput}
              value={returnDate ? formatToReadable(returnDate) : ''}
              editable={false}
              placeholder="Select Date"
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.reserveButton}
        onPress={() => {
          if (!reserveDate || !returnDate) {
            alert('Please select a reservation date.');
            return;
          }
          navigation.navigate('ReservationSummary', {
            item,
            reserveDate,
            returnDate,
            fee: displayFee,
          });
        }}
      >
        <Text style={styles.reserveButtonText}>Reserve</Text>
      </TouchableOpacity>

      <CalendarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(start, end) => {
          setReserveDate(start);
          setReturnDate(end);
          setModalVisible(false);
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a6b',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 70, // lowered from top
    marginHorizontal: 16,
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
  imageContainer: {
    backgroundColor: '#fff',
    width: width * 0.8,
    height: 250,
    borderRadius: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  contentWrapper: {
    width: width * 0.8,
    alignSelf: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLeft: {
    flex: 1.3,
  },
  infoRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: 24,
  },
  itemName: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  label: {
    fontSize: 20,
    color: '#ccc',
  },
  department: {
    color: 'white',
    fontSize: 17,
    marginBottom: 20,
  },
  availability: {
    color: 'white',
    fontSize: 14,
  },
  availableText: {
    color: 'lightgreen',
    fontWeight: '600',
  },
  feeLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  feeValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsSection: {
    marginTop: 14,
    alignItems: 'left',
  },
  detailsTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 30,
  },
  detailsDescription: {
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 12,
    marginVertical: 6,
    marginBottom: 30,

  },
  note: {
    fontSize: 11,
    fontStyle: 'italic',
    color: 'pink',
    textAlign: 'center',
  },
  reservationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 32, // moved lower
  },
  calendarIconBox: {
    backgroundColor: '#a9a9a9',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    marginTop: 35,
  },
  dateFields: {
    flex: 1,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 4,
  },
  dateInput: {
    backgroundColor: '#e4e4e4',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 13,
    color: '#000',
  },
  reserveButton: {
    position: 'absolute',
    bottom: 20, // raised a bit from bottom
    width: '100%',
    height: 50,
    backgroundColor: '#f8c200',
    paddingVertical: 16,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
