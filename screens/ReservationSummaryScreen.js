import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SignaturePad from '../components/SignaturePad';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ReservationSummaryScreen({ route }) {
  const navigation = useNavigation();
  const { item, reserveDate, returnDate, fee } = route.params;

  const [termsChecked, setTermsChecked] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const imageUrl = item.image?.startsWith('http')
    ? item.image
    : `http://192.168.46.115:8000${item.image}`;

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


  const handleConfirm = async () => {
    if (!termsChecked || !signatureData) {
      Alert.alert('Missing Info', 'Please agree to the terms and sign before confirming.');
      return;
    }

    try {
      if (!reserveDate || !returnDate) {
        console.log("❌ reserveDate or returnDate is missing", reserveDate, returnDate);
        Alert.alert('Date Error', 'Reservation dates are missing.');
        return;
      }

      const startDate = new Date(reserveDate);
      const endDate = new Date(returnDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.log("❌ Invalid date formats", reserveDate, returnDate);
        Alert.alert('Date Error', 'Invalid date format.');
        return;
      }

      const pad = (n) => n.toString().padStart(2, '0');
      const formatDate = (date) =>
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;

      const token = await AsyncStorage.getItem('access'); // ✅ Get JWT token

      if (!token) {
        Alert.alert('Authentication Error', 'You are not logged in.');
        return;
      }

      const payload = {
        item_id: item.id,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        signature: signatureData,
      };

      console.log("🔼 Sending Reservation Payload:", payload);

      const response = await fetch('http://192.168.46.115:8000/api/reserve/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // ✅ JWT Auth header
        },
        body: JSON.stringify(payload),
      });

      console.log("🔽 Response Status:", response.status);
      const data = await response.json();
      console.log("🔽 Response Body:", data);

      if (response.ok && data.reservation) {
        const reservation = data.reservation;

        navigation.navigate('ReservationReceipt', {
          transactionId: reservation.transaction_id,
          item: item,
          reserveDate: reservation.start_datetime,
          returnDate: reservation.end_datetime,
          fee: reservation.fee,
        });
      } else {
        Alert.alert('Reservation Failed', data.message || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to the server.');
      console.log("❌ Fetch Error:", error);
    }
  };


  const clearSignature = () => {
    setSignatureData(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={16} color="#f8c200" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservation Summary</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Borrow Date & Time:</Text>
        <Text style={styles.value}>{formatISOToReadable(reserveDate)}</Text>

        <Text style={styles.label}>Returned Date & Time:</Text>
        <Text style={styles.value}>{formatISOToReadable(returnDate)}</Text>

        <Text style={styles.feeLine}>
          <Text style={styles.feeLabel}>Fee: </Text>
          {fee}
        </Text>

        {/* Item Info */}
        <View style={styles.itemRow}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.itemImage} resizeMode="contain" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.department}>{item.department || 'SCITC'}</Text>
          </View>
        </View>

        {/* Terms & Signature */}
        <View style={styles.termsBox}>
          <View style={styles.termsRow}>
            <TouchableOpacity
              style={[styles.checkbox, termsChecked && styles.checkboxChecked]}
              onPress={() => setTermsChecked(!termsChecked)}
            >
              {termsChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.termsLabel}>Terms & Condition:</Text>
          </View>
          <Text style={[styles.termsText, { color: termsChecked ? '#fff' : '#ccc' }]}>
            By borrowing an item, the user agrees to return it in good condition on or before the due date and accepts full
            responsibility for any loss or damage incurred during the borrowing period.
          </Text>
        </View>

        {/* Signature */}
        <TouchableOpacity style={styles.addSignatureButton} onPress={() => setShowSignaturePad(true)}>
          <Text style={styles.addSignatureText}>Add Signature</Text>
        </TouchableOpacity>

        {signatureData && (
          <View style={styles.signatureWrapper}>
            <Image source={{ uri: signatureData }} style={styles.signaturePreview} />
            <TouchableOpacity onPress={clearSignature} style={styles.trashButton}>
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Confirm Button */}
      <TouchableOpacity
        style={[
          styles.confirmButton,
          !(termsChecked && signatureData) && { backgroundColor: '#ccc' },
        ]}
        onPress={handleConfirm}
        disabled={!(termsChecked && signatureData)}
      >
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>

      {/* Signature Modal */}
      {showSignaturePad && (
        <SignaturePad
          onSave={(data) => {
            setSignatureData(data);
            setShowSignaturePad(false);
          }}
          onCancel={() => setShowSignaturePad(false)}
        />
      )}
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
  label: {
    color: '#fff',
    fontSize: 20,
    marginTop: 40,
    fontWeight: 'bold',
  },
  value: {
    color: '#fff',
    fontSize: 16,
    marginBottom: -25,
  },
  feeLine: {
    color: '#fff',
    fontSize: 16,
    marginTop: 40,
    marginBottom: 6,
  },
  feeLabel: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  itemRow: {
    flexDirection: 'row',
    marginTop: 50,
    alignItems: 'center',
  },
  imageContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 15,
  },
  itemImage: {
    width: '80%',
    height: '80%',
  },
  itemName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 50,
  },
  department: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 70,
    marginTop: -50,
    marginLeft: 5,
  },
  termsBox: {
    marginTop: 30,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: '#ffffffff',
  },
  termsLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  termsText: {
    color: '#ffffffff',
    fontSize: 17,
    marginTop: 8,
    lineHeight: 25,
    textAlign: 'justify',
  },
  addSignatureButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  addSignatureText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signatureWrapper: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  signaturePreview: {
    width: width * 0.9,
    height: 120,
    resizeMode: 'contain',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  trashButton: {
    position: 'absolute',
    top: 90,
    right: 8,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8c200ff',
    paddingVertical: 25,
    alignItems: 'center',
  },
  confirmText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
