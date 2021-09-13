import React from 'react';

import {
  createMaterialBottomTabNavigator
} from '@react-navigation/material-bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './ScreensMain/HomeScreen';
import SearchScreen from './ScreensMain/SearchScreen';
import RequestsScreen from './ScreensMain/RequestsScreen';
import ProfileScreen from './ScreensMain/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();

export default function MainTabScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
    >

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarColor:'#D2B48C',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-home" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarColor:'#D2B48C',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-search" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
        options={{
          tabBarLabel: 'Requests',
          tabBarColor: '#D2B48C',
          tabBarIcon: ({ color }) => (
            <Icon name="request" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarColor: '#D2B48C',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}