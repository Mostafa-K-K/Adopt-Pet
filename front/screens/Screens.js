import React, { useContext } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import MainTabScreen from './MainTabScreen';
import AdminScreen from './AdminScreen';
import RootStackScreen from './RootStackScreen';

import SessionContext from '../components/SessionContext';

export default function Screens() {

    let { session: { user: { token, role_id } } } = useContext(SessionContext);
    console.log(role_id);
    return (
        <NavigationContainer>
            {!token ?
                <RootStackScreen />
                :
                role_id == "admin" ?
                    <AdminScreen />
                    :
                    role_id == "user" ?
                        <MainTabScreen />
                        :
                        null

            }
        </NavigationContainer >
    );
}