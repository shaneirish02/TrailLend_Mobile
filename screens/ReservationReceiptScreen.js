import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function ReservationReceiptScreen({ route }) {
  const { transactionId, item, reserveDate, returnDate, fee } = route.params;
  const navigation = useNavigation();
  const qrRef = useRef();

  const formatISOToReadable = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid date';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = ((hours + 11) % 12) + 1;
    return `${yyyy}-${mm}-${dd} ${displayHour}:${minutes} ${ampm}`;
  };

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need storage permission to save the QR Code.');
        return;
      }

      qrRef.current.toDataURL(async (data) => {
        const fileUri = FileSystem.documentDirectory + `qr_${transactionId}.png`;
        await FileSystem.writeAsStringAsync(fileUri, data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await MediaLibrary.saveToLibraryAsync(fileUri);
        Alert.alert('Success', 'QR Code saved to your gallery.');
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to save QR Code.');
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={16} color="#f8c200" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservation Receipt</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.receiptCard}>
          <Text style={styles.label}>Transaction ID</Text>
          <Text style={styles.value}>{transactionId?.toString() || 'N/A'}</Text>

          <Text style={styles.label}>Item</Text>
          <Text style={styles.value}>{item?.name || 'N/A'}</Text>

          <Text style={styles.label}>Department</Text>
          <Text style={styles.value}>{item?.department || 'SCITC'}</Text>

          <Text style={styles.label}>Borrow Date & Time</Text>
          <Text style={styles.value}>{formatISOToReadable(reserveDate)}</Text>

          <Text style={styles.label}>Return Date & Time</Text>
          <Text style={styles.value}>{formatISOToReadable(returnDate)}</Text>

          <Text style={styles.label}>Fee</Text>
          <Text style={styles.value}>{fee || 'Free'}</Text>

          <Text style={styles.label}>QR Code</Text>
          <View style={styles.qrContainer}>
            <QRCode
              value={transactionId?.toString() || '0'}
              size={180}
              getRef={(c) => (qrRef.current = c)}
            />
          </View>

          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <Ionicons name="download-outline" size={18} color="#fff" />
            <Text style={styles.downloadText}>Download QR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>
            Please present this QR Code and receipt to the administrator on the day of your reservation.
            Failing to do so may result in cancellation. Handle all borrowed items with care.
          </Text>
        </View>

        {/* ✅ Back to Dashboard button */}
        <TouchableOpacity style={styles.dashboardButton} onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="home-outline" size={18} color="#fff" />
          <Text style={styles.downloadText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginTop: 70,
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
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  receiptCard: {
    backgroundColor: '#f8c200',
    padding: 20,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
    color: '#1a1a1a',
  },
  value: {
    fontSize: 15,
    marginTop: 2,
    color: '#1a1a1a',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  downloadButton: {
    marginTop: 20,
    backgroundColor: '#1a1a6b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  downloadText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  noteContainer: {
    backgroundColor: '#ffffff22',
    padding: 16,
    borderRadius: 8,
    borderColor: '#f8c200',
    borderWidth: 1,
  },
  noteTitle: {
    color: '#f8c200',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  noteText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
  dashboardButton: {
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: '#1a1a6b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
});
