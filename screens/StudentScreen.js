import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  Animated, Dimensions, TouchableOpacity
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import axios from 'axios';

const { width } = Dimensions.get('window');
const boxSize = width * 0.7;

export default function SignUpScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const animation = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (!scannedData) startAnimation();
  }, [scannedData]);

  const startAnimation = () => {
    animation.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, { toValue: boxSize - 4, duration: 2000, useNativeDriver: true }),
        Animated.timing(animation, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  };

  const handleBarCodeScanned = ({ data }) => {
    const match = data.match(/(.*?)(\d{10})\s+(\w+)/);
    if (match) {
      const name = match[1].trim();
      const studentId = match[2];
      const course = match[3];
      setScannedData({ name, studentId, course });
    } else {
      alert('QR format not recognized. Please try again.');
    }
  };

  const handleChange = (field, value) => {
    if (field === 'password') detectPasswordStrength(value);
    setFormData({ ...formData, [field]: value });
  };

  const detectPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength('Weak');
    } else if (password.match(/[A-Za-z]/) && password.match(/[0-9]/) && password.length >= 8) {
      setPasswordStrength('Strong');
    } else {
      setPasswordStrength('Medium');
    }
  };

  const handleSubmit = async () => {
    if (!scannedData) {
      alert('Please scan your Student ID QR first.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('http://192.168.46.115:8000/api/users/register/', {
        name: scannedData.name,
        student_id: scannedData.studentId,
        course: scannedData.course,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      });

      if (response.status === 201) {
        alert('Account created!');
        navigation.navigate('Login');
      } else {
        alert(response.data.message || 'Registration failed.');
      }
    } catch (err) {
      console.log(err);
      alert('Failed to connect to server.');
    }
  };

  if (hasPermission === null) {
    return <View style={styles.center}><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.center}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      {!scannedData ? (
        <View style={styles.qrWrapper}>
          <Text style={styles.scanHeader}>SCAN STUDENT QR ID</Text>
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.cameraPreview}
              onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
              facing="back"
            >
              <View style={styles.scanBox}>
                <Animated.View style={[styles.scanLine, { transform: [{ translateY: animation }] }]} />
              </View>
            </CameraView>
          </View>
          <Text style={styles.instruction}>Align your Student ID QR within the box</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.detailsTitle}>Details:</Text>
          <View style={styles.detailsBox}>
            <Text style={styles.detailItem}>{scannedData.name}</Text>
            <Text style={styles.detailItem}>{scannedData.studentId}</Text>
            <Text style={styles.detailItem}>{scannedData.course}</Text>
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={formData.email} onChangeText={(t) => handleChange('email', t)} keyboardType="email-address" />

          <Text style={styles.label}>Mobile</Text>
          <TextInput style={styles.input} value={formData.mobile} onChangeText={(t) => handleChange('mobile', t)} keyboardType="phone-pad" />

          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} secureTextEntry value={formData.password} onChangeText={(t) => handleChange('password', t)} />
          <Text style={[
            styles.strength,
            passwordStrength === 'Weak' && { color: 'red' },
            passwordStrength === 'Medium' && { color: 'orange' },
            passwordStrength === 'Strong' && { color: 'green' }
          ]}>
            {passwordStrength ? `Strength: ${passwordStrength}` : ''}
          </Text>

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput style={styles.input} secureTextEntry value={formData.confirmPassword} onChangeText={(t) => handleChange('confirmPassword', t)} />

          <TouchableOpacity style={styles.signUpButton} onPress={handleSubmit}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  qrWrapper: {
    flex: 1,
    backgroundColor: '#1F1B4F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  scanHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  cameraContainer: {
    width: boxSize,
    height: boxSize,
    overflow: 'hidden',
    borderRadius: 16,
    borderColor: '#3498db',
    borderWidth: 3,
  },
  cameraPreview: {
    flex: 1,
  },
  scanBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 2,
    backgroundColor: 'red',
  },
  instruction: {
    marginTop: 10,
    color: '#ccc',
    fontSize: 14,
  },

  formContainer: {
    padding: 20,
    backgroundColor: '#1F1B4F',
    flexGrow: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FAB417',
    marginBottom: 0,
    marginTop: 80,
    textAlign: 'center',
  },
  detailsTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  detailsBox: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  detailItem: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  strength: {
    fontWeight: '600',
    marginBottom: 8,
  },
  signUpButton: {
    backgroundColor: '#FFC107',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 10,
  },
  signUpText: {
    color: '#1F1B4F',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
