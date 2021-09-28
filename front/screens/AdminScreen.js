import React, { useState, useContext } from 'react';

import {
    View,
    TextInput,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity
} from 'react-native';

import {
    createMaterialBottomTabNavigator
} from '@react-navigation/material-bottom-tabs';

import {
    createStackNavigator
} from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';

import ProfileAdminScreen from './ScreensAdmin/ProfileAdminScreen';
import UsersScreen from './ScreensAdmin/UsersScreen';
import ReportScreen from './ScreensAdmin/ReportScreen';

import ProfileUserScreen from './ScreensAdmin/ProfileUserScreen';
import InfoPostUserScreen from './ScreensAdmin/InfoPostUserScreen';

import EditProfileScreen from './ScreensMain/EditProfileScreen';
import ChangeUsernameScreen from './ScreensMain/ChangeUsernameScreen';
import ChangePasswordScreen from './ScreensMain/ChangePasswordScreen';
import ChangeInformationScreen from './ScreensMain/ChangeInformationScreen';

import * as Animatable from 'react-native-animatable';

import API from '../API';
import SessionContext from '../components/SessionContext';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function ProfileStackScreen() {

    const {
        session: { user: { token } },
        actions: { signOut }
    } = useContext(SessionContext);

    async function handleLogout() {
        await API.post('signOut', { token });
        await signOut();
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#D2B48C',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    marginLeft: 10
                }
            }}
        >
            <Stack.Screen
                name='Profile'
                component={ProfileAdminScreen}
                options={{
                    headerRight: () => (
                        <Icon
                            name='ios-log-out-outline'
                            size={25}
                            style={styles.iconButton}
                            onPress={handleLogout}
                        />
                    )
                }}
            />

            <Stack.Screen
                name='editprofile'
                component={EditProfileScreen}
                options={{ title: 'Edit Profile' }}
            />

            <Stack.Screen
                name='changeinformation'
                component={ChangeInformationScreen}
                options={{ title: 'Personel Information' }}
            />

            <Stack.Screen
                name='changeusername'
                component={ChangeUsernameScreen}
                options={{ title: 'Username' }}
            />

            <Stack.Screen
                name='changepassword'
                component={ChangePasswordScreen}
                options={{ title: 'Password' }}
            />

        </Stack.Navigator>
    )
}

function UsersStackScreen() {

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#D2B48C',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    marginLeft: 10
                }
            }}
        >
            <Stack.Screen
                name='Users'
                component={UsersScreen}
            />

            <Stack.Screen
                name='userinfoprofile'
                component={ProfileUserScreen}
                options={{ title: 'User Profile' }}
            />

            <Stack.Screen
                name='infopostuser'
                component={InfoPostUserScreen}
                options={{ title: 'Post Info' }}
            />

        </Stack.Navigator>
    )
}

export default function AdminScreen() {
    return (
        <Tab.Navigator
            initialRouteName='profile'
        >

            <Tab.Screen
                name='report'
                component={ReportScreen}
                options={{
                    tabBarLabel: 'Reports',
                    tabBarColor: '#D2B48C',
                    tabBarIcon: ({ color }) => (
                        <Icon name='md-warning-outline' color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen
                name='user'
                component={UsersStackScreen}
                options={{
                    tabBarLabel: 'Users',
                    tabBarColor: '#D2B48C',
                    tabBarIcon: ({ color }) => (
                        <Icon name='list' color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen
                name='profile'
                component={ProfileStackScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarColor: '#D2B48C',
                    tabBarIcon: ({ color }) => (
                        <Icon name='ios-person' color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}


const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({

  icon: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
  },
  iconButton: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  }
});