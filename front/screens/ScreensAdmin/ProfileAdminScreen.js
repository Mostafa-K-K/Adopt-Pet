import React, { useState, useEffect, useContext, useCallback } from 'react';

import {
    View,
    Text,
    Image,
    Button,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { useFocusEffect } from '@react-navigation/native';

import moment from 'moment';
import API from '../../API';
import SessionContext from '../../components/SessionContext';

export default function ProfileAdminScreen({ navigation }) {

    const { session: { user: { _id } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        posts: [],

        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        birthDate: "",
        username: ""
    });

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }))
    }

    function fetchData() {

        API.get(`users/${_id}`)
            .then(res => {
                const success = res.data.success;
                if (success) {
                    const result = res.data.result;
                    setState({
                        firstName: result.firstName,
                        lastName: result.lastName,
                        phone: result.phone,
                        address: result.address,
                        birthDate: result.birthDate,
                        username: result.username
                    });
                }
            });

        API.get(`/blogsuser/${_id}`)
            .then(res => {
                const success = res.data.success;
                if (success) {
                    const result = res.data.result;
                    setState({
                        posts: result
                    });
                }
            });
    }

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.styleTextProfile}>
                    <View style={styles.flexRowView}>
                        <Text style={styles.boldTextStyle}>Username : </Text>
                        <Text>{state.username}</Text>
                    </View>

                    <View style={styles.flexRowView}>
                        <Text style={styles.boldTextStyle}>Name : </Text>
                        <Text>{state.firstName} {state.lastName}</Text>
                    </View>

                    <View style={styles.flexRowView}>
                        <Text style={styles.boldTextStyle}>Phone Number : </Text>
                        <Text>{state.phone}</Text>
                    </View>

                    <View style={styles.flexRowView}>
                        <Text style={styles.boldTextStyle}>Address : </Text>
                        <Text>{state.address}</Text>
                    </View>

                    <View style={styles.flexRowView}>
                        <Text style={styles.boldTextStyle}>Birth Date : </Text>
                        <Text>{moment(state.birthDate).format('D   MMMM   YYYY')}</Text>
                    </View>

                    <View style={{ padding: 20 }}>
                        <Button
                            title='Edit Profile'
                            color='#D2B48C'
                            onPress={() => navigation.navigate('editprofile')}
                        />
                    </View>

                </View>
            </ScrollView>
        </View>
    )
}


const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF'
    },
    styleTextProfile: {
        padding: 10,
        height: width,
        width: width / 1.1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    flexRowView: {
        flexDirection: 'row',
    },
    boldTextStyle: {
        fontWeight: 'bold',
        marginRight: 5
    }
});