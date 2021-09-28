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

import HomeScreen from './ScreensMain/HomeScreen';
import SearchScreen from './ScreensMain/SearchScreen';
import ProfileScreen from './ScreensMain/ProfileScreen';

import RequestsSenderScreen from './ScreensMain/RequestsSenderScreen';
import RequestsReceiverScreen from './ScreensMain/RequestsReceiverScreen';
import ContactUserInfo from './ScreensMain/ContactUserInfo';

import LikedPosts from './ScreensMain/LikedPosts';
import CreatePostScreen from './ScreensMain/CreatePostScreen';

import InfoPostScreen from './ScreensMain/InfoPostScreen';
import EditPostScreen from './ScreensMain/EditPostScreen';
import EditProfileScreen from './ScreensMain/EditProfileScreen';
import ChangeUsernameScreen from './ScreensMain/ChangeUsernameScreen';
import ChangePasswordScreen from './ScreensMain/ChangePasswordScreen';
import ChangeInformationScreen from './ScreensMain/ChangeInformationScreen';

import * as Animatable from 'react-native-animatable';

import API from '../API';
import SessionContext from '../components/SessionContext';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeStackScreen({ navigation }) {

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#D2B48C',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }}
    >
      <Stack.Screen
        name='Pet House'
        component={HomeScreen}
        options={{
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>

              <Icon
                name='ios-heart'
                size={25}
                style={styles.iconButton}
                onPress={() => navigation.navigate('likedposts')}
              />

              <Icon
                name='ios-add'
                size={30}
                style={styles.iconButton}
                onPress={() => navigation.navigate('createpost')}
              />

            </View>
          )
        }}
      />

      <Stack.Screen
        name='createpost'
        component={CreatePostScreen}
        options={{ title: 'Create Post' }}
      />

      <Stack.Screen
        name='likedposts' component={LikedPosts}
        options={{
          title: 'Liked Posts',
          headerRight: () => (
            <Icon
              name='ios-heart'
              size={25}
              style={styles.iconButton}
            />
          )
        }}
      />
    </Stack.Navigator>
  )
}

function SearchStackScreen() {

  const [state, updateState] = useState({
    name: '',
    show: false
  })

  function setState(nextState) {
    updateState(prevState => ({
      ...prevState,
      ...nextState
    }))
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#D2B48C',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          marginLeft: 10,
          fontSize: state.show ? 0 : 20
        }
      }}
    >
      <Stack.Screen
        name='Search'
        children={() => <SearchScreen name={state.name} />}
        options={{
          headerRight: () => (
            state.show ? null :
              <Icon
                name='ios-search'
                size={25}
                style={styles.icon}
                onPress={() => setState({ show: true })}
              />
          ),
          headerLeft: () => (
            !state.show ? null :
              <View style={{ flexDirection: 'row' }}>
                <Icon
                  name='ios-arrow-back'
                  size={25}
                  style={styles.icon}
                  onPress={() => setState({ show: false })}
                />
                <Animatable.View animation='fadeInRight' duration={500} style={styles.viewSearch}>
                  <TextInput
                    autoFocus
                    placeholder='Search . . .'
                    placeholderTextColor='rgba(0,0,0,0.3)'
                    color='#000'
                    value={state.name}
                    maxLength={20}
                    onChangeText={(val) => setState({ name: val })}
                  />
                </Animatable.View>
              </View>
          )
        }}
        searchString={state.name}
      />
    </Stack.Navigator>
  )
}

function RequestsStackScreen({ navigation }) {

  const [isSent, setIsSent] = useState(false);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#D2B48C',
          height: 70
        },
        headerTintColor: 'transparent',
        headerTitleStyle: {
          fontSize: 0
        }
      }}
    >
      <Stack.Screen
        name='receiverRequest'
        component={isSent ? RequestsSenderScreen : RequestsReceiverScreen}
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setIsSent(true)}
              underlayColor="transparent"
              activeOpacity={1}
            >
              <View style={isSent ? styles.buttonStyleActive : styles.buttonStyle}>
                <Text style={{ fontSize: 20, color: isSent ? '#D2B48C' : '#FFFFFF' }}>Sent</Text>
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setIsSent(false)}
              underlayColor="transparent"
              activeOpacity={1}
            >
              <View style={!isSent ? styles.buttonStyleActive : styles.buttonStyle}>
                <Text style={{ fontSize: 20, color: !isSent ? '#D2B48C' : '#FFFFFF' }}>Received</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />

      <Stack.Screen
        name='contactuserinfo'
        component={ContactUserInfo}
        options={{ title: "Contact Info" }}
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
        component={ProfileScreen}
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

      <Stack.Screen
        name='infopost'
        component={InfoPostScreen}
        options={{ title: 'info Post' }}
      />

      <Stack.Screen
        name='editpost'
        component={EditPostScreen}
        options={{ title: 'edit Post' }}
      />

    </Stack.Navigator>
  )
}

export default function MainTabScreen() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
    >

      <Tab.Screen
        name='home'
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: '#D2B48C',
          tabBarIcon: ({ color }) => (
            <Icon name='ios-home' color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name='search'
        component={SearchStackScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarColor: '#D2B48C',
          tabBarIcon: ({ color }) => (
            <Icon name='ios-search' color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name='requests'
        component={RequestsStackScreen}
        options={{
          tabBarLabel: 'Requests',
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
  viewSearch: {
    width: width / 1.25,
    height: 35,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingLeft: 20,
    alignContent: 'center',
    paddingTop: 3
  },
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
  },
  buttonStyle: {
    alignItems: 'center',
    padding: 3,
    width: width / 2.5,
    marginRight: width / 20,
    marginLeft: width / 20,
    backgroundColor: '#D2B48C',
    borderRadius: 5
  },
  buttonStyleActive: {
    alignItems: 'center',
    padding: 3,
    width: width / 2.5,
    marginRight: width / 20,
    marginLeft: width / 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 5
  }
});