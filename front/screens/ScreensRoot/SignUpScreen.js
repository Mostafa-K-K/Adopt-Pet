import React, { useState, useContext } from 'react';

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
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import moment from 'moment';
import API from '../../API';
import SessionContext from '../../components/SessionContext';

export default function SignInScreen({ navigation }) {

    const { actions: { signUp } } = useContext(SessionContext);

    const [state, updateState] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        birthDate: new Date(),
        gender: 'Male',
        username: '',
        password: '',
        conPassword: '',

        show: false,

        usernameExist: false,
        phoneExist: false,

        isValidFirstName: false,
        isValidLastName: false,
        isValidPhone: false,
        isValidAddress: false,
        isValidUser: false,
        isValidPassword: false,
        isValidConfPassword: false,

        secureTextEntry: true,
        confirm_secureTextEntry: true,
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
                setState({ isValidUser: false }) :
                setState({ isValidUser: true });
        setState({ usernameExist: false });
    }

    function handlePasswordChange(val) {
        val = val.replace(/\s/g, '');
        setState({ password: val.trim() });
        (val == '') ?
            setState({ isValidPassword: false })
            :
            (val.trim().length >= 8) ?
                setState({ isValidPassword: false }) :
                setState({ isValidPassword: true });
    }

    function handleConfirmPasswordChange(val) {
        val = val.replace(/\s/g, '');
        setState({ conPassword: val });
        (val == '') ?
            setState({ isValidConfPassword: false })
            :
            (val == state.password) ?
                setState({ isValidConfPassword: false }) :
                setState({ isValidConfPassword: true });
    }

    function handleDate(e, nextDate) {
        const prevDate = state.birthDate
        const date = nextDate || prevDate;
        setState({ birthDate: date, show: false })
    };

    function handleSignUp() {

        let reqBody = {
            firstName: state.firstName.trim(),
            lastName: state.lastName.trim(),
            gender: state.gender,
            phone: state.phone.trim(),
            address: state.address.trim(),
            birthDate: state.birthDate,
            username: state.username,
            password: state.password
        }

        if (reqBody.firstName != ''
            && reqBody.lastName != ''
            && reqBody.phone != ''
            && reqBody.address != ''
            && !state.isValidUser
            && !state.isValidPassword
            && !state.isValidConfPassword
        ) {

            let phones = API.post(`isvalidphone`, reqBody);
            let usernames = API.post(`isvalidusername`, reqBody);

            if (phones.data && phones.data.result.length) setState({ phoneExist: true });
            if (usernames.data && usernames.data.result.length) setState({ usernameExist: true });

            if ((!phones.data || !phones.data.result.length) && (!usernames.data || !usernames.data.result.length)) {
                API.post(`signUp`, reqBody)
                    .then(res => {
                        const success = res.data.success;
                        if (success) {
                            const user = res.data.result;
                            signUp(user);
                        }
                    });
            }
        }
        else {
            if (reqBody.firstName == '') setState({ isValidFirstName: true });
            if (reqBody.lastName == '') setState({ isValidLastName: true });
            if (reqBody.phone == '') setState({ isValidPhone: true });
            if (reqBody.address == '') setState({ isValidAddress: true });
            if (reqBody.username == '') setState({ isValidUser: true });
            if (reqBody.password == '') setState({ isValidPassword: true });
            if (state.conPassword == '') setState({ isValidConfPassword: true });
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#D2B48C' barStyle='light-content' />
            <View style={styles.header}>
                <Text style={styles.text_header}>Register Now!</Text>
            </View>
            <Animatable.View
                animation='fadeInUpBig'
                style={styles.footer}
            >
                <ScrollView>
                    <Text style={styles.text_footer}>First Name</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name='hashtag'
                            color='#D2B48C'
                            size={20}
                        />
                        <TextInput
                            placeholder='First Name'
                            style={styles.textInput}
                            autoCapitalize='none'
                            onChangeText={(val) => setState({ firstName: val, isValidFirstName: false })}
                        />
                    </View>
                    {state.isValidFirstName ?
                        <Animatable.View animation='fadeInLeft' duration={500}>
                            <Text style={styles.errorMsg}>Please fill this field</Text>
                        </Animatable.View>
                        : null
                    }

                    <Text style={[styles.text_footer, {
                        marginTop: 15
                    }]}>Last Name</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name='pencil'
                            color='#D2B48C'
                            size={20}
                        />
                        <TextInput
                            placeholder='Last Name'
                            style={styles.textInput}
                            autoCapitalize='none'
                            onChangeText={(val) => setState({ lastName: val, isValidLastName: false })}
                        />
                    </View>
                    {state.isValidLastName ?
                        <Animatable.View animation='fadeInLeft' duration={500}>
                            <Text style={styles.errorMsg}>Please fill this field</Text>
                        </Animatable.View>
                        : null
                    }

                    <Text style={[styles.text_footer, {
                        marginTop: 15
                    }]}>Gender</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name='venus-mars'
                            color='#D2B48C'
                            size={24}
                        />
                        <RadioButton.Group
                            value={state.gender}
                            onValueChange={val => setState({ gender: val })}
                        >
                            <View style={{ flexDirection: 'row', marginTop: -15 }}>
                                <RadioButton.Item
                                    label='Male'
                                    value='Male'
                                    position='leading'
                                    color='#D2B48C'
                                    uncheckedColor='#D2B48C'
                                />
                                <RadioButton.Item
                                    label='Female'
                                    value='Female'
                                    position='leading'
                                    color='#D2B48C'
                                    uncheckedColor='#D2B48C'
                                />
                            </View>
                        </RadioButton.Group>
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 15
                    }]}>Phone Number</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name='phone'
                            color='#D2B48C'
                            size={20}
                        />
                        <TextInput
                            placeholder='Phone Number'
                            style={styles.textInput}
                            autoCapitalize='none'
                            onChangeText={(val) => setState({ phone: val, isValidPhone: false, phoneExist: false })}
                            keyboardType='numeric'
                        />
                    </View>
                    {state.isValidPhone ?
                        <Animatable.View animation='fadeInLeft' duration={500}>
                            <Text style={styles.errorMsg}>Please fill this field</Text>
                        </Animatable.View>
                        :
                        state.phoneExist ?
                            <Animatable.View animation='fadeInLeft' duration={500}>
                                <Text style={styles.errorMsg}>Phone number already exist.</Text>
                            </Animatable.View>
                            : null
                    }

                    <Text style={[styles.text_footer, {
                        marginTop: 15
                    }]}>Address</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name='map-o'
                            color='#D2B48C'
                            size={20}
                        />
                        <TextInput
                            placeholder='Address'
                            style={styles.textInput}
                            autoCapitalize='none'
                            onChangeText={(val) => setState({ address: val, isValidAddress: false })}
                        />
                    </View>
                    {state.isValidAddress ?
                        <Animatable.View animation='fadeInLeft' duration={500}>
                            <Text style={styles.errorMsg}>Please fill this field</Text>
                        </Animatable.View>
                        : null
                    }

                    <Text style={[styles.text_footer, {
                        marginTop: 15
                    }]}>Birth Date</Text>
                    <View>
                        <TouchableOpacity
                            style={styles.action}
                            onPress={() => setState({ show: true })}
                        >
                            <FontAwesome
                                name='calendar'
                                color='#D2B48C'
                                size={20}
                            />
                            <TextInput
                                editable={false}
                                style={styles.textInput}
                            >
                                {moment(state.birthDate).format('D   MMMM   YYYY')}
                            </TextInput>
                        </TouchableOpacity>
                        {state.show && (
                            <DateTimePicker
                                value={state.birthDate}
                                maximumDate={new Date()}
                                mode="date"
                                onChange={handleDate}
                            />
                        )}
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 15
                    }]}>Username</Text>
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
                        {!state.isValidUser && state.username !== '' ?
                            <Animatable.View
                                animation='bounceIn'
                            >
                                <Feather
                                    name='check-circle'
                                    color={state.usernameExist ? '#D11A2A' : '#D2B48C'}
                                    size={20}
                                />
                            </Animatable.View>
                            : null}
                    </View>
                    {state.isValidUser ?
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

                    <Text style={[styles.text_footer, {
                        marginTop: 15
                    }]}>Password</Text>
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
                            <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
                        </Animatable.View>
                        : null
                    }

                    <Text style={[styles.text_footer, {
                        marginTop: 15
                    }]}>Confirm Password</Text>
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
                    {state.isValidConfPassword || (state.isValidPassword && state.password == '') ?
                        <Animatable.View animation='fadeInLeft' duration={500}>
                            <Text style={styles.errorMsg}>Confrim password incorrect.</Text>
                        </Animatable.View>
                        : null
                    }

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={handleSignUp}
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
        </View >
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