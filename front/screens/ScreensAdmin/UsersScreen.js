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
                                <Text>Username : {user.username}</Text>
                                <Text>Name : {user.firstName} {user.lastName}</Text>
                                <Text>Phone Number : {user.phone}</Text>
                                <Text>Address : {user.address}</Text>
                                <Text>Birth Date : {moment(user.birthDate).format('D   MMMM   YYYY')}</Text>
                            </View>
                        </Card.Content>

                        <Button
                            title="View"
                            onPress={() => navigation.navigate('userinfoprofile', { _User: user._id })}
                        />
                    </Card>
                )
                }
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
});