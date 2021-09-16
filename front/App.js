import React, { useState, useEffect, useReducer, useMemo } from 'react';

import {
  View,
  ActivityIndicator
} from 'react-native';

import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

import { AsyncStorage } from 'react-native';
import { AuthContext } from './components/context';

import MainTabScreen from './screens/MainTabScreen';
import RootStackScreen from './screens/RootStackScreen';

export default function App() {

  const [initialLoginState, updateState] = useState({
    isLoading: true,
    _id: null,
    token: null,
  });

  function setState(nextState) {
    updateState(prevState => ({
      ...prevState,
      ...nextState
    }))
  }

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          token: action.token,
          isLoading: false,
        };
      case 'SIGNIN':
        return {
          ...prevState,
          _id: action._id,
          token: action.token,
          isLoading: false,
        };
      case 'SIGNOUT':
        return {
          ...prevState,
          _id: null,
          token: null,
          isLoading: false,
        };
      case 'SIGNUP':
        return {
          ...prevState,
          _id: action._id,
          token: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = useMemo(() => ({

    signIn: async (user) => {
      const _id = String(user._id);
      const token = String(user.token);

      setState({ token: token });
      setState({ isLoading: false });

      try {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('_id', _id);
      } catch (e) {
        console.log(e);
      }

      dispatch({ type: 'SIGNIN', _id: _id, token: token });
    },

    signOut: async () => {
      setState({ token: null });
      setState({ isLoading: false });

      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('_id');
      } catch (e) {
        console.log(e);
      }

      dispatch({ type: 'SIGNOUT' });
    },

    signUp: async (user) => {
      const _id = String(user._id);
      const token = String(user.token);

      setState({ token: token });
      setState({ isLoading: false });

      try {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('_id', _id);
      } catch (e) {
        console.log(e);
      }

      dispatch({ type: 'SIGNUP', _id: _id, token: token });
    }

  }), []);

  useEffect(() => {

    async function fetchData() {
      // setIsLoading(false);
      let token = null;
      let _id = null;

      try {
        token = await AsyncStorage.getItem('token');
        _id = await AsyncStorage.getItem('_id');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: token });
    }
    fetchData()
  }, []);


  return (
    (loginState.isLoading) ?
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
      :
      <PaperProvider>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer>
            {loginState.token !== null ?
              <MainTabScreen />
              :
              <RootStackScreen />
            }
          </NavigationContainer>
        </AuthContext.Provider>
      </PaperProvider>
  );
}