import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';

const { height } = Dimensions.get('window');

export default function RoleScreen({ navigation }) {
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
          <Text style={styles.subtitle}>Please Select Your Role to Sign Up</Text>

          <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Instructor')}>
              <Image source={require('../assets/instructor.png')} style={styles.image} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Student')}>
              <Image source={require('../assets/student.png')} style={styles.image} />
            </TouchableOpacity>
          </View>
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
  logo: {
    width: 60,
    height: 52,
    marginTop: -100,
    marginBottom: -20,
    marginLeft: -20,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'sans-serif-medium',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    alignSelf: 'center',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 25,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 230,
    alignItems: 'center',
    elevation: 5,
  },
  image: {
    width: 230,
    height: 300,
    borderRadius: 2,
  },
});
