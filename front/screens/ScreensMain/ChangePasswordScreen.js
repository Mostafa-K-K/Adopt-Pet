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

import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';

import API from '../../API';
import SessionContext from '../../components/SessionContext';

const bcrypt = require("bcryptjs");

export default function ChangePasswordScreen({ navigation }) {

    const { session: { user: { _id } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        oldPassword: '',

        password: '',
        newPassword: '',
        conPassword: '',


        isValidPassword: false,
        isValidNewPassword: false,
        isValidConfPassword: false,

        secureTextEntry: true,
        new_secureTextEntry: true,
        confirm_secureTextEntry: true
    });

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }))
    }

    function handlePasswordChange(val) {
        val = val.replace(/\s/g, '');
        setState({ password: val.trim() });
        setState({ isValidPassword: false })
    }

    function handleNewPasswordChange(val) {
        val = val.replace(/\s/g, '');
        setState({ newPassword: val.trim() });
        (val == '') ?
            setState({ isValidNewPassword: false })
            :
            (val.trim().length >= 8) ?
                setState({ isValidNewPassword: false }) :
                setState({ isValidNewPassword: true });
    }

    function handleConfirmPasswordChange(val) {
        val = val.replace(/\s/g, '');
        setState({ conPassword: val });
        (val == '') ?
            setState({ isValidConfPassword: false })
            :
            (val == state.newPassword) ?
                setState({ isValidConfPassword: false }) :
                setState({ isValidConfPassword: true });
    }

    async function handleUpdate() {
        let reqBody = { password: state.newPassword }

        let isMatch = await bcrypt.compare(state.password, state.oldPassword);

        isMatch ?
            setState({ isValidPassword: false }) :
            setState({ isValidPassword: true });

        state.newPassword !== state.conPassword ?
            setState({ isValidConfPassword: true }) :
            setState({ isValidConfPassword: false });

        if (state.password == '') setState({ isValidPassword: true });
        if (state.newPassword == '') setState({ isValidNewPassword: true });
        if (state.conPassword == '') setState({ isValidConfirmPassword: true });

        if (isMatch && state.newPassword == state.conPassword) {
            if (!state.isValidPassword
                && !state.isValidNewPassword
                && !state.isValidConfPassword
            ) {
                API.put(`users/${_id}`, reqBody)
                    .then(res => {
                        const success = res.data.success;
                        if (success) navigation.navigate('Profile');
                    });
            }
        }
    }

    function fetchData() {
        API.get(`users/${_id}`)
            .then(res => {
                const success = res.data.success;
                if (success) {
                    const result = res.data.result;
                    setState({
                        oldPassword: result.password
                    });
                }
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>

            <View>
                <Text style={styles.text_footer}>Old Password</Text>
                <View style={styles.action}>
                    <Feather
                        name='lock'
                        color='#D2B48C'
                        size={20}
                    />
                    <TextInput
                        placeholder='Your Old Password'
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


            <View>
                <Text style={styles.text_footer}>New Password</Text>
                <View style={styles.action}>
                    <Feather
                        name='lock'
                        color='#D2B48C'
                        size={20}
                    />
                    <TextInput
                        placeholder='Your New Password'
                        secureTextEntry={state.new_secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize='none'
                        value={state.newPassword}
                        onChangeText={(val) => handleNewPasswordChange(val)}
                    />
                    <TouchableOpacity
                        onPress={() => setState({ new_secureTextEntry: !state.new_secureTextEntry })}
                    >
                        {state.new_secureTextEntry ?
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
                {state.isValidNewPassword ?
                    <Animatable.View animation='fadeInLeft' duration={500}>
                        <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
                    </Animatable.View>
                    : null
                }
            </View>


            <View>
                <Text style={styles.text_footer}>Confirm Password</Text>
                <View style={styles.action}>
                    <Feather
                        name='unlock'
                        color='#D2B48C'
                        size={20}
                    />
                    <TextInput
                        placeholder='Confirm Your Password'
                        secureTextEntry={state.confirm_secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize='none'
                        value={state.conPassword}
                        onChangeText={(val) => handleConfirmPasswordChange(val)}
                    />
                    <TouchableOpacity
                        onPress={() => setState({ confirm_secureTextEntry: !state.confirm_secureTextEntry })}
                    >
                        {state.confirm_secureTextEntry ?
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
                {state.isValidConfPassword ?
                    <Animatable.View animation='fadeInLeft' duration={500}>
                        <Text style={styles.errorMsg}>Confrim password incorrect.</Text>
                    </Animatable.View>
                    : null
                }
            </View>

            <View style={styles.styleButton}>
                <Button
                    title='Update Password'
                    color='#D2B48C'
                    onPress={handleUpdate}
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 15
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
        color: '#D11A2A',
        fontSize: 14,
    },
    styleButton: {
        padding: 30
    }
});