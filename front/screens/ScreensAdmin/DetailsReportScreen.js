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
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import API from '../../API';
import { get } from 'lodash';

export default function DetailsReportScreen(props) {

    const _Reported = get(props.route.params, '_Reported');

    const [state, updateState] = useState({
        reports: [],

        reportSelected: '',
        confirmDelete: false
    });

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }))
    }

    function handleDelete() {
        API.delete(`reports/${state.reportSelected}`)
            .then(res => {
                const success = res.data.success;
                if (success) {
                    setState({ reportSelected: '', confirmDelete: false });
                    fetchData();
                }
            })
    }

    async function fetchData() {
        await API.post('getByReported', { _Reported })
            .then(res => {
                const success = res.data.success;
                if (success) {
                    const data = res.data.result;
                    setState({ reports: data });
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
        !state.reports.length ?
            <View style={styles.containerViewEmpty}>
                <Animatable.View
                    style={styles.containerViewEmpty}
                    animation="pulse"
                    easing="ease-out"
                    iterationCount="infinite"
                >
                    <Icon
                        name='search'
                        size={25}
                        style={styles.icon}
                    />
                    <Text
                        style={[styles.icon, { fontSize: 24 }]}
                    >
                        &nbsp; &nbsp; Loading
                    </Text>
                </Animatable.View>
            </View>
            :
            <ScrollView style={styles.container}>
                {state.reports.map(report =>
                    <View
                        style={styles.divCard}
                        key={report._id}
                    >
                        <Image
                            style={styles.stylePic}
                            source={{ uri: `http://192.168.43.79:8000/uploads/${report._Blog.photo}` }}
                        />

                        <View style={styles.styleInfo}>
                            <Text style={{ fontWeight: 'bold' }}>Reporter :</Text>
                            <Text>{report._Reporter.username} </Text>
                            <Text></Text>
                            <Text style={{ fontWeight: 'bold' }}>Reported Post :</Text>
                            <Text>{report._Blog.animal} {report._Blog.kind} {report._Blog.name}</Text>
                        </View>

                        <View style={styles.styleAction}>
                            <TouchableOpacity
                                style={{ marginTop: 15 }}
                                onPress={() => setState({ reportSelected: report._id, confirmDelete: true })}
                            >
                                <Icon
                                    name='trash'
                                    color='#D11A2A'
                                    size={30}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={state.confirmDelete}
                    onRequestClose={() => {
                        setState({ confirmDelete: false, reportSelected: '' })
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Delete Report?</Text>

                            <View style={{ width: width / 2, margin: 5 }}>
                                <Button
                                    title='Delete'
                                    color='#D11A2A'
                                    onPress={handleDelete}
                                />
                            </View>

                            <View style={{ width: width / 2, margin: 5 }}>
                                <Button
                                    title='Cancel'
                                    color='#D2B48C'
                                    onPress={() => setState({ confirmDelete: false, reportSelected: '' })}
                                />
                            </View>

                        </View>
                    </View>
                </Modal>

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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 15
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    divCard: {
        width: width,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
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