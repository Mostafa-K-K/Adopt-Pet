import React, { useState } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

export default function SignInScreen({ navigation }) {

    const [state, updateState] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        birthDate: '',
        gender: '',
        username: '',
        password: '',
        confirm_password: '',

        isValidUser: true,

        isValidPassword: true,
        secureTextEntry: true,

        isValidConfPassword: true,
        confirm_secureTextEntry: true,
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
            setState({ isValidUser: true }) :
            setState({ isValidUser: false });
    }

    function handlePasswordChange(val) {
        setState({ password: val });

        (val.trim().length >= 8) ?
            setState({ isValidPassword: true }) :
            setState({ isValidPassword: false });
    }

    function handleConfirmPasswordChange(val) {
        setState({ confirm_password: val });

        (val == state.password) ?
            setState({ isValidConfPassword: true }) :
            setState({ isValidConfPassword: false });
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#D2B48C' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Register Now!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView>
                    <Text style={styles.text_footer}>First Name</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user"
                            color='#D2B48C'
                            size={20}
                        />
                        <TextInput
                            placeholder="First Name"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setState({ firstName: val })}
                        />
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Last Name</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user"
                            color='#D2B48C'
                            size={20}
                        />
                        <TextInput
                            placeholder="Last Name"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setState({ lastName: val })}
                        />
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Phone Number</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="phone"
                            color='#D2B48C'
                            size={20}
                        />
                        <TextInput
                            placeholder="Phone Number"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setState({ phone: val })}
                            keyboardType="numeric"
                        />
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Address</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="map"
                            color='#D2B48C'
                            size={20}
                        />
                        <TextInput
                            placeholder="Address"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setState({ address: val })}
                        />
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Username</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color='#D2B48C'
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Username"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)}
                        />
                        {state.isValidUser ?
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

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color='#D2B48C'
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Password"
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

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Confirm Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color='#D2B48C'
                            size={20}
                        />
                        <TextInput
                            placeholder="Confirm Your Password"
                            secureTextEntry={state.confirm_secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleConfirmPasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={() => setState({ confirm_secureTextEntry: !state.confirm_secureTextEntry })}
                        >
                            {state.confirm_secureTextEntry ?
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
                    {state.isValidConfPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Confrim password incorrect.</Text>
                        </Animatable.View>
                    }

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => { }}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Sign Up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[styles.signIn, {
                                borderColor: '#D2B48C',
                                backgroundColor: '#FFFFFF',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#D2B48C'
                            }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        flex: Platform.OS === 'ios' ? 3 : 5,
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
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
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