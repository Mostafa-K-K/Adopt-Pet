import React, { useState, useEffect, useCallback } from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Button,
    Alert,
    Modal,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Card,
    Title,
    Paragraph
} from 'react-native-paper';

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import API from '../../API';

export default function ReportScreen({ navigation }) {

    const [reports, setReports] = useState([])

    async function fetchData() {
        await API.post('getReportsCount')
            .then(res => {
                const success = res.data.success;
                if (success) {
                    const data = res.data.result;
                    setReports(data);
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
        !reports.length ?
            <View style={styles.containerViewEmpty}>
                <Animatable.View
                    style={styles.containerViewEmpty}
                    animation="pulse"
                    easing="ease-out"
                    iterationCount="infinite"
                >
                    <Icon
                        name='alert-circle-outline'
                        size={25}
                        style={styles.icon}
                    />
                    <Text
                        style={[styles.icon, { fontSize: 24 }]}
                    >
                        &nbsp; &nbsp; No Reports Yet!
                    </Text>
                </Animatable.View>
            </View>
            :
            <ScrollView style={styles.container}>
                {reports.map(report =>
                    <TouchableOpacity
                        key={report._id}
                        style={styles.divCard}
                        onPress={() => navigation.navigate('detailsReport', { _Reported: report._id })}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold' }}>Username : </Text>
                            <Text>{report.username}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold' }}>Count : </Text>
                            <Text>{report.count}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>
    )
}


const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    containerViewEmpty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    icon: {
        backgroundColor: 'transparent',
        color: 'rgba(0,0,0,0.3)',
        fontSize: 35.
    },
    divCard: {
        width: width,
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    stylePic: {
        width: width / 3.2,
        height: width / 3.2,
        borderRadius: 5,
        alignSelf: 'center'
    },
    styleInfo: {
        width: width / 2,
        textAlign: 'left',
        paddingLeft: 10,
        alignSelf: 'center'
    },
    styleAction: {
        flexDirection: 'column',
        alignContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center'
    }
});