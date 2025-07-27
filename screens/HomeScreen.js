import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';


export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>TrailLend</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Admin Tap Here Link */}
        <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')}>
          <Text style={styles.adminLink}>Admin? Tap here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1B4F',
    alignItems: 'center',
    paddingTop: 270,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 70,
  },
  logoTitleContainer: {
    marginLeft: 30,
    alignItems: 'flex-start',
    marginBottom: 20,
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
  buttonsContainer: {
    width: '80%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#F6B10E',
    paddingVertical: 14,
    width: '100%',
    borderRadius: 6,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adminLink: {
    marginTop: 10,
    textDecorationLine: 'underline',
    color: '#f8c200',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
