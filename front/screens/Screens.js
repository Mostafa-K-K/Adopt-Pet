import React, { useContext } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import MainTabScreen from './MainTabScreen';
import RootStackScreen from './RootStackScreen';

import SessionContext from '../components/SessionContext';

export default function Screens() {

    let { session: { user: { token } } } = useContext(SessionContext);

    return (
        <NavigationContainer>
            {token ?
                <MainTabScreen />
                :
                <RootStackScreen />
            }
        </NavigationContainer>
    );
}