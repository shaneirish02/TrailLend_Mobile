import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../DashboardScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#f8c200', // Full background color
          height: 60,
          borderTopWidth: 0, // optional: removes border
        },
      }}
    >
      <Tab.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={24}
              color="#fff" // Always white icon
            />
          ),
        }}
      />
      {/* Add more tabs here if needed */}
    </Tab.Navigator>
  );
}
