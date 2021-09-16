import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    StatusBar
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function SplashScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#D2B48C' barStyle="light-content" />
            <View style={styles.header}>
                <Animatable.Image
                    animation="bounceIn"
                    duraton="1500"
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="stretch"
                />
            </View>
            <Animatable.View
                style={[styles.footer, {
                    backgroundColor: "#FFFFFF"
                }]}
                animation="fadeInUpBig"
            >
                <Text style={styles.title}>Pet House</Text>
                <Text style={styles.text}>Sign in with account</Text>
                <View style={styles.viewLogoSmall}>
                    <Animatable.Image
                        animation="bounceIn"
                        duraton="1500"
                        source={require('../../assets/logo.png')}
                        style={styles.logoSmall}
                        resizeMode="stretch"
                    />
                </View>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => navigation.navigate('SignInScreen')}>
                        <Text style={styles.textSign}>Get Started</Text>
                        <MaterialIcons
                            name="navigate-next"
                            color="#fff"
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    )
}

const { height } = Dimensions.get("screen");
const height_logo = height * 0.30;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D2B48C'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo: {
        width: height_logo,
        height: height_logo
    },
    logoSmall: {
        width: height_logo / 3,
        height: height_logo / 3,
    },
    viewLogoSmall: {
        position: "absolute",
        bottom: 70,
        left: 40,
        transform: [
            { rotateZ: "-25deg" }
        ]
    },
    title: {
        color: '#000000',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        marginTop: 5
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row',
        backgroundColor: '#D2B48C'
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold'
    }
});