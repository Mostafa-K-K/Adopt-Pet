import React, { useState, useContext } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import API from '../../API';
import SessionContext from '../../components/SessionContext';

export default function SignInScreen({ navigation }) {

    const { actions: { signIn } } = useContext(SessionContext);

    const [state, updateState] = useState({
        username: '',
        password: '',

        isValidUser: false,
        isValidUserIcon: false,

        isValidPassword: false,
        secureTextEntry: true,
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
            setState({ isValidUser: false })
            :
            (val.trim().length >= 6) ?
                setState({ isValidUser: false, isValidUserIcon: true }) :
                setState({ isValidUser: true, isValidUserIcon: false });
    }

    function handlePasswordChange(val) {
        val = val.replace(/\s/g, '');
        setState({ password: val });
        (val == '') ?
            setState({ isValidPassword: false })
            :
            (val.trim().length >= 8) ?
                setState({ isValidPassword: false }) :
                setState({ isValidPassword: true });
    }

    function handleSignIn() {
        let reqBody = {
            username: state.username,
            password: state.password
        }
        if (!state.isValidUser && !state.isValidPassword && state.password != '' && state.username != '') {
            API.post(`signIn`, reqBody)
                .then(res => {
                    const success = res.data.success;
                    if (success) {
                        const data = res.data.result;
                        signIn(data);
                    }
                    else {
                        setState({
                            username: "",
                            password: ""
                        });
                    }
                });
        }
        else {
            if (reqBody.username == '') setState({ isValidUser: true });
            if (reqBody.password == '') setState({ isValidPassword: true });
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#D2B48C' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Welcome!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={[styles.footer, {
                    backgroundColor: "#FFFFFF"
                }]}
            >
                <Text style={styles.text_footer}>
                    Username
                </Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color='#D2B48C'
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Username"
                        placeholderTextColor="#666666"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={state.username}
                        onChangeText={(val) => handleUsernameChange(val)}
                    />
                    {state.isValidUserIcon ?
                        <Animatable.View
                            animation="bounceIn"
                        >
                            <Feather
                                name="check-circle"
                                color='#D2B48C'
                                size={20}
                            />
                        </Animatable.View>
                        : null}
                </View>
                {state.isValidUser ?
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Username must be 6 characters long.</Text>
                    </Animatable.View>
                    : null
                }


                <Text style={[styles.text_footer, { marginTop: 35 }]}>
                    Password
                </Text>
                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color='#D2B48C'
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Password"
                        placeholderTextColor="#666666"
                        secureTextEntry={state.secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={state.password}
                        onChangeText={(val) => handlePasswordChange(val)}
                    />
                    <TouchableOpacity
                        onPress={() => setState({ secureTextEntry: !state.secureTextEntry })}
                    >
                        {state.secureTextEntry ?
                            <Feather
                                name="eye-off"
                                color='#D2B48C'
                                size={20}
                            />
                            :
                            <Feather
                                name="eye"
                                color='#D2B48C'
                                size={20}
                            />
                        }
                    </TouchableOpacity>
                </View>
                {state.isValidPassword ?
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
                    </Animatable.View>
                    : null
                }


                <TouchableOpacity>
                    <Text style={{ color: '#D2B48C', marginTop: 15 }}>Forgot password?</Text>
                </TouchableOpacity>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={handleSignIn}
                    >
                        <Text style={[styles.textSign, {
                            color: '#fff'
                        }]}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUpScreen')}
                        style={[styles.signIn, {
                            borderColor: '#D2B48C',
                            backgroundColor: '#FFFFFF',
                            borderWidth: 1,
                            marginTop: 15
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: '#D2B48C'
                        }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D2B48C'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#FFFFFF',
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
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#D11A2A',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#000000'
    },
    errorMsg: {
        color: '#D11A2A',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
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
    }
});