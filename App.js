import 'react-native-reanimated'; 
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Set up axios
axios.defaults.withCredentials = true;

// ✅ Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import DrawerNavigator from './screens/drawer/DrawerNavigator';
import ItemDetailsScreen from './screens/ItemDetailsScreen'; 
import ReservationSummaryScreen from './screens/ReservationSummaryScreen';
import ReservationReceiptScreen from './screens/ReservationReceiptScreen';
import NotificationScreen from './screens/NotificationScreen';

import RoleScreen from './screens/RoleScreen';
import StudentScreen from './screens/StudentScreen';
import InstructorScreen from './screens/InstructorScreen';
import AdminLoginScreen from './screens/admin/AdminLoginScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Optional: listen for notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("🔔 Notification Received:", notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("📲 Notification Clicked:", response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
        <Stack.Screen name="SignUp" component={RoleScreen} />
        <Stack.Screen name="Student" component={StudentScreen} />
        <Stack.Screen name="Instructor" component={InstructorScreen} />
        <Stack.Screen name="Dashboard" component={DrawerNavigator} />
        <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
        <Stack.Screen name="ReservationSummary" component={ReservationSummaryScreen} />
        <Stack.Screen name="ReservationReceipt" component={ReservationReceiptScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ✅ Register for push notifications
async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("📱 Expo Push Token:", token);

  await AsyncStorage.setItem('expo_push_token', token);

  // ✅ Optional: send to your backend
  try {
    await axios.post('http://192.168.226.115:8000/api/save_push_token/', {
      token: token,
    });
  } catch (error) {
    console.error('Failed to save push token:', error.response?.data || error.message);
  }
}
