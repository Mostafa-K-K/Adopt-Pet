import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function Home(props) {
    const { navigation } = props;
    return (
        <>
            <View style={styles.container}>
                <Text>Hello Maria</Text>
                <StatusBar style="auto" />
            </View>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        backgroundColor: 'rgb(15, 159, 255)',
        borderRadius: 10,
        padding: 10,
        width: 100,
        marginRight: 'auto',
        marginLeft: 'auto',
        textAlign: 'center',
        marginTop: 5
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
});