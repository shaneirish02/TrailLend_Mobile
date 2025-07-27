import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.226.115:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userID,     // ✅ should be 'username' for SimpleJWT
          password: password,
        }),
      });

      const data = await response.json();

      console.log('🔐 Login Response:', data);

      if (response.ok) {
        await AsyncStorage.setItem('access', data.access);   // ✅ Store access token
        await AsyncStorage.setItem('refresh', data.refresh); // ✅ Store refresh token if needed
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Login Failed', data.detail || 'Invalid credentials.');
      }
    } catch (error) {
      console.error('❌ Login Error:', error);
      Alert.alert('Error', 'Something went wrong during login.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>TrailLend</Text>
      </View>

      <Text style={styles.subtitle}>LOG IN</Text>

      <Text style={styles.label}>Instructor/Student ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your ID number"
        value={userID}
        onChangeText={setUserID}
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />

      <View style={styles.rowBetween}>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
          <View style={[styles.checkbox, rememberMe && styles.checkedBox]}>
            {rememberMe && <Text style={styles.check}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Remember Me</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Welcome Howling Lycan!</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 100,
    backgroundColor: '#1F1B4F',
    flexGrow: 1,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 60,
    marginTop: 120,
  },
  logo: {
    width: 80,
    height: 62,
    marginBottom: -20,
    marginLeft: -152,
  },
  title: {
    fontSize: 50,
    color: '#fff',
    fontFamily: 'sans-serif-medium',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#F6B10E',
    marginTop: 20,
    marginBottom: 2,
  },
  label: {
    color: '#fff',
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    backgroundColor: '#fff',
    color: '#000',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    alignSelf: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  checkedBox: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: 'white',
    fontSize: 14,
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  forgotText: {
    color: '#286cfdff',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#F6B10E',
    padding: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 60,
    color: '#fff',
    fontWeight: '600',
  },
});
