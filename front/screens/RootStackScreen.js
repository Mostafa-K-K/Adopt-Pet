import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './ScreensRoot/SplashScreen';
import SignInScreen from './ScreensRoot/SignInScreen';
import SignUpScreen from './ScreensRoot/SignUpScreen';

const RootStack = createStackNavigator();

export default function RootStackScreen() {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }} >
            <RootStack.Screen name="SplashScreen" component={SplashScreen} />
            <RootStack.Screen name="SignInScreen" component={SignInScreen} />
            <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
        </RootStack.Navigator>
    );
}