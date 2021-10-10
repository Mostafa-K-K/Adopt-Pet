import React, { useEffect, useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    Image,
    Button,
    Alert,
    Modal,
    ScrollView,
    Dimensions
} from 'react-native';

import {
    Card,
    Title,
    Paragraph
} from 'react-native-paper';

import moment from 'moment';
import API from '../../API';

export default function UsersScreen({ navigation }) {

    const [users, setUsers] = useState([]);

    function fetchData() {
        API.get(`users`)
            .then(res => {
                const success = res.data.success;
                if (success) {
                    const result = res.data.result;
                    setUsers(result);
                }
            })
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (!users.length ?
        <View style={styles.containerEmpty}>
            <Text>No Requests!</Text>
        </View>
        :
        <View style={styles.container}>
            <ScrollView>
                {users.map(user =>
                    <Card
                        key={user._id}
                        style={styles.cartStyle}
                    >
                        <Card.Content>
                            <View>
                                <View style={styles.flexRowView}>
                                    <Text style={styles.boldTextStyle}>Username : </Text>
                                    <Text>{user.username}</Text>
                                </View>

                                <View style={styles.flexRowView}>
                                    <Text style={styles.boldTextStyle}>Name : </Text>
                                    <Text>{user.firstName} {user.lastName}</Text>
                                </View>

                                <View style={styles.flexRowView}>
                                    <Text style={styles.boldTextStyle}>Phone Number : </Text>
                                    <Text>{user.phone}</Text>
                                </View>

                                <View style={styles.flexRowView}>
                                    <Text style={styles.boldTextStyle}>Address : </Text>
                                    <Text>{user.address}</Text>
                                </View>

                                <View style={styles.flexRowView}>
                                    <Text style={styles.boldTextStyle}>Birth Date : </Text>
                                    <Text>{moment(user.birthDate).format('D   MMMM   YYYY')}</Text>
                                </View>
                            </View>
                        </Card.Content>

                        <View style={styles.styleButton}>
                            <Button
                                title="View"
                                color='#D2B48C'
                                onPress={() => navigation.navigate('userinfoprofile', { _User: user._id })}
                            />
                        </View>

                    </Card>
                )}
            </ScrollView >
        </View >
    )
}


const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
    containerEmpty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF'
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    cartStyle: {
        shadowOffset: { width: 10, height: 10 },
        width: width,
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 15
    },
    styleButton: {
        padding: 30
    },
    flexRowView: {
        flexDirection: 'row',
    },
    boldTextStyle: {
        fontWeight: 'bold',
        marginRight: 5
    }
});