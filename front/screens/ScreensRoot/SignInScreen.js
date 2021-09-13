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

// import { AuthContext } from '../components/context';

// import Users from '../model/users';

export default function SignInScreen({ navigation }) {

    // const { signIn } = useContext(AuthContext);

    const [state, updateState] = useState({
        username: '',
        password: '',

        isValidUser: true,
        isValidUserIcon: false,

        isValidPassword: true,
        secureTextEntry: true,
    });

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }))
    }

    function textInputChange(val) {
        setState({ username: val });

        (val.trim().length >= 6) ?
            setState({ isValidUser: true, isValidUserIcon: true }) :
            setState({ isValidUser: false, isValidUserIcon: false });
    }

    function handlePasswordChange(val) {
        setState({ password: val });

        (val.trim().length >= 8) ?
            setState({ isValidPassword: true }) :
            setState({ isValidPassword: false });
    }

    function loginHandle() {
        // const foundUser = Users.filter(item => {
        //     return userName == item.username && password == item.password;
        // });

        // if (data.username.length == 0 || data.password.length == 0) {
        //     Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
        //         { text: 'Okay' }
        //     ]);
        //     return;
        // }

        // if (foundUser.length == 0) {
        //     Alert.alert('Invalid User!', 'Username or password is incorrect.', [
        //         { text: 'Okay' }
        //     ]);
        //     return;
        // }
        // signIn(foundUser);
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
                        onChangeText={(val) => textInputChange(val)}
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
                {state.isValidUser ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Username must be 6 characters long.</Text>
                    </Animatable.View>
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
                {state.isValidPassword ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
                    </Animatable.View>
                }


                <TouchableOpacity>
                    <Text style={{ color: '#D2B48C', marginTop: 15 }}>Forgot password?</Text>
                </TouchableOpacity>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={loginHandle}
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
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
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
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
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