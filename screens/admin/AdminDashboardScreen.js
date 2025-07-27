import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default function AdminDashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />

      <View style={styles.topRight}>
        <TouchableOpacity onPress={() => navigation.replace('Home')}>
          <Text style={styles.logout}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>TrailLend</Text>
        <Text style={styles.subtitle}>Admin Dashboard</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Scan to Reserve</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Scan to Return</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1B4F',
  },
  logo: {
    width: 60,
    height: 52,
    marginTop: 40,
    marginLeft: 20,
  },
  topRight: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  logout: {
    color: '#f8c200',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    marginTop: height * 0.15,
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontFamily: 'sans-serif-medium',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 22,
    color: '#f8c200',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#f8c200',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
