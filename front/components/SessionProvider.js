import React, { useState, useEffect } from 'react';
import API from '../API';
import { AsyncStorage } from 'react-native';
import SessionContext from './SessionContext';

export default function SessionProvider({ children }) {

    const [session, updateSession] = useState({ user: {} });

    function setSession(nextSession) {
        updateSession(prevSession => ({
            ...prevSession,
            ...nextSession
        }));
    }

    async function signIn(user) {
        const _id = String(user._id);
        const token = String(user.token);
        const role_id = String(user.role_id);
        setSession({
            user: {
                _id: _id,
                token: token,
                role_id: role_id
            }
        });
        try {
            await AsyncStorage.setItem('_id', _id);
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('role_id', role_id);
        } catch (e) {
            console.log(e);
        }
    }

    async function signOut() {
        setSession({
            user: {}
        });
        try {
            await AsyncStorage.removeItem('_id');
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('role_id');
        } catch (e) {
            console.log(e);
        }
    }

    async function signUp(user) {
        const _id = String(user._id);
        const token = String(user.token);
        const role_id = String(user.role_id);
        setSession({
            user: {
                _id: _id,
                token: token,
                role_id: role_id
            }
        });
        try {
            await AsyncStorage.setItem('_id', _id);
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('role_id', role_id);
        } catch (e) {
            console.log(e);
        }
    }

    async function initializeUser() {

        let _id = await AsyncStorage.getItem('_id');
        let token = await AsyncStorage.getItem('token');

        if (_id && token) {
            await API.post('initialiseData', { _id, token })
                .then(res => {
                    const success = res.data.success;
                    if (success) {
                        const data = res.data.result;
                        if (data)
                            setSession({
                                user: {
                                    ...session.user,
                                    _id: data._id,
                                    token: data.token,
                                    role_id: data.role_id
                                }
                            })
                    }
                });
        }
    }

    async function getSession() {
        let _id = await AsyncStorage.getItem('_id');
        let token = await AsyncStorage.getItem('token');
        let role_id = await AsyncStorage.getItem('role_id');

        setSession({ user: { _id, token, role_id } });
        initializeUser();
    }

    useEffect(() => {
        getSession();
    }, []);

    let context = { session, actions: { signIn, signUp, signOut } }

    return (
        <SessionContext.Provider value={context}>
            {children}
        </SessionContext.Provider>
    )
}