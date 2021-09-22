import React, { useState, useEffect, useContext } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    Button
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';

import API from '../../API';
import SessionContext from '../../components/SessionContext';

const bcrypt = require("bcryptjs");

export default function ChangeUsernameScreen({ navigation }) {

    const { session: { user: { _id } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        oldPassword: '',

        username: '',
        password: '',

        usernameExist: false,
        isValidUsername: false,
        isValidPassword: false,
        secureTextEntry: true
    });

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }))
    }

    function handleUsernameChange(val) {
        val = val.replace(/\s/g, '');
        setState({ username: val });
        (val == '') ?
            setState({ isValidUsername: false })
            :
            (val.trim().length >= 6) ?
                setState({ isValidUsername: false }) :
                setState({ isValidUsername: true });
        setState({ usernameExist: false });
    }

    function handlePasswordChange(val) {
        val = val.replace(/\s/g, '');
        setState({ password: val.trim() });
        setState({ isValidPassword: false })
    }

    async function handleUpdate() {
        let reqBody = { username: state.username }

        let isMatch = await bcrypt.compare(state.password, state.oldPassword);

        isMatch ?
            setState({ isValidPassword: false }) :
            setState({ isValidPassword: true });

        if (state.password == '') setState({ isValidPassword: true });
        if (state.username == '') setState({ isValidUsername: true });

        if (state.password != '' && state.username != '') {
            API.post(`isvalidusername`, reqBody)
                .then(res => {
                    const success = res.data.success;
                    if (success) {
                        const result = res.data.result;
                        if (!result || (result && result._id == _id)) {
                            if (isMatch) {
                                if (!state.isValidPassword
                                    && !state.isValidUsername
                                ) {
                                    API.put(`users/${_id}`, reqBody)
                                        .then(res => {
                                            const success = res.data.success;
                                            if (success) navigation.navigate('Profile');
                                        });
                                }
                            }
                        } else { setState({ usernameExist: true }) }
                    }
                });
        }
    }

    function fetchData() {
        API.get(`users/${_id}`)
            .then(res => {
                const success = res.data.success;
                if (success) {
                    const result = res.data.result;
                    setState({ oldPassword: result.password });
                }
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>

            <View>
                <Text style={styles.text_footer}>Username</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name='user-o'
                        color='#D2B48C'
                        size={20}
                    />
                    <TextInput
                        placeholder='Your Username'
                        style={styles.textInput}
                        autoCapitalize='none'
                        value={state.username}
                        onChangeText={(val) => handleUsernameChange(val)}
                    />
                    {!state.isValidUsername && state.username != '' ?
                        <Animatable.View
                            animation='bounceIn'
                        >
                            <Feather
                                name='check-circle'
                                color={state.usernameExist ? '#FF0000' : '#D2B48C'}
                                size={20}
                            />
                        </Animatable.View>
                        : null}
                </View>
                {state.isValidUsername ?
                    <Animatable.View animation='fadeInLeft' duration={500}>
                        <Text style={styles.errorMsg}>Username must be 6 characters long.</Text>
                    </Animatable.View>
                    :
                    state.usernameExist ?
                        <Animatable.View animation='fadeInLeft' duration={500}>
                            <Text style={styles.errorMsg}>Username already exist.</Text>
                        </Animatable.View>
                        : null
                }
            </View>


            <View>
                <Text style={styles.text_footer}>Password</Text>
                <View style={styles.action}>
                    <Feather
                        name='lock'
                        color='#D2B48C'
                        size={20}
                    />
                    <TextInput
                        placeholder='Your Password'
                        secureTextEntry={state.secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize='none'
                        value={state.password}
                        onChangeText={(val) => handlePasswordChange(val)}
                    />
                    <TouchableOpacity
                        onPress={() => setState({ secureTextEntry: !state.secureTextEntry })}
                    >
                        {state.secureTextEntry ?
                            <Feather
                                name='eye-off'
                                color='#D2B48C'
                                size={20}
                            />
                            :
                            <Feather
                                name='eye'
                                color='#D2B48C'
                                size={20}
                            />
                        }
                    </TouchableOpacity>
                </View>
                {state.isValidPassword ?
                    <Animatable.View animation='fadeInLeft' duration={500}>
                        <Text style={styles.errorMsg}>Password Incorrect.</Text>
                    </Animatable.View>
                    : null
                }
            </View>

            <Button title="Update Username" onPress={handleUpdate} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#000000',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -5,
        paddingLeft: 10,
        color: '#000000'
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#D2B48C'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
});