// screens/WelcomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/bg-img.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.title}>TrailLend</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1B4F',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    marginTop: height * 0.2,
    marginLeft: 30,
    alignItems: 'flex-start',
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
    marginLeft: -27,
  },
  title: {
    fontSize: 50,
    color: '#fff',
    fontFamily: 'sans-serif-medium',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#F6B10E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: -10, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
