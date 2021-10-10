import React, { useContext } from 'react';

import {
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import {
    createStackNavigator
} from '@react-navigation/stack';

import {
    createMaterialBottomTabNavigator
} from '@react-navigation/material-bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import ReportScreen from './ScreensAdmin/ReportScreen';
import DetailsReportScreen from './ScreensAdmin/DetailsReportScreen'

import PostsScreen from './ScreensAdmin/PostsScreen';

import UsersScreen from './ScreensAdmin/UsersScreen';
import ProfileUserScreen from './ScreensAdmin/ProfileUserScreen';
import InfoPostUserScreen from './ScreensAdmin/InfoPostUserScreen';

import EditProfileScreen from './ScreensMain/EditProfileScreen';
import ProfileAdminScreen from './ScreensAdmin/ProfileAdminScreen';
import ChangeUsernameScreen from './ScreensMain/ChangeUsernameScreen';
import ChangePasswordScreen from './ScreensMain/ChangePasswordScreen';
import ChangeInformationScreen from './ScreensMain/ChangeInformationScreen';

import API from '../API';
import SessionContext from '../components/SessionContext';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function ReportStackScreen() {

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
                name='Reports'
                component={ReportScreen}
            />

            <Stack.Screen
                name='detailsReport'
                component={DetailsReportScreen}
                options={{ title: 'Details Report' }}
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

function PostsStackScreen() {

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
                component={PostsScreen}
            />

            <Stack.Screen
                name='infopostuser'
                component={InfoPostUserScreen}
                options={{ title: 'Post Info' }}
            />

        </Stack.Navigator>
    )
}

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
                        <TouchableOpacity onPress={handleLogout}>
                            <Icon
                                name='ios-log-out-outline'
                                size={25}
                                style={styles.iconButton}
                            />
                        </TouchableOpacity>
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

export default function AdminScreen() {
    return (
        <Tab.Navigator
            initialRouteName='profile'
        >

            <Tab.Screen
                name='report'
                component={ReportStackScreen}
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
                        <Icon name='ios-people-outline' color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen
                name='posts'
                component={PostsStackScreen}
                options={{
                    tabBarLabel: 'Posts',
                    tabBarColor: '#D2B48C',
                    tabBarIcon: ({ color }) => (
                        <Icon name='image-outline' color={color} size={26} />
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