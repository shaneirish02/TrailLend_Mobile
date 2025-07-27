import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import MainTabNavigator from './MainTabNavigator';
import ReservationStatus from '../ReservationStatus';
import EditProfileScreen from '../EditProfileScreen';
import ReportDamage from '../ReportDamage';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#f8c200',
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen
        name="DashboardTab"
        component={MainTabNavigator}
        options={{
          title: 'Dashboard',
          drawerIcon: () => <Ionicons name="home" size={20} />,
        }}
      />
      <Drawer.Screen
        name="Reservation Status"
        component={ReservationStatus}
        options={{
          drawerIcon: () => <Ionicons name="calendar-outline" size={20} />,
        }}
      />
      <Drawer.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={{
          drawerIcon: () => <Ionicons name="person-outline" size={20} />,
        }}
      />
      <Drawer.Screen
        name="Report Damage"
        component={ReportDamage}
        options={{
          drawerIcon: () => <Ionicons name="alert-circle-outline" size={20} />,
        }}
      />
    </Drawer.Navigator>
  );
}
