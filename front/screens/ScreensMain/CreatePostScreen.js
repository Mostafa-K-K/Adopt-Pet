import React, { useState, useContext } from 'react';

import {
    View,
    Text,
    Image,
    Button,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    Dimensions
} from 'react-native';
import { RadioButton } from 'react-native-paper';

import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import NativeColorPicker from 'native-color-picker';

import API from '../../API';
import SessionContext from '../../components/SessionContext';

export default function CreatePostScreen({ navigation }) {

    const { session: { user: { _id } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        name: '',
        animal: '',
        kind: '',
        photo: '',
        gender: 'Male',
        age: '',
        color: '#FFFFFF',
        description: '',

        showColor: false,
        validPost: true
    });

    const [colors] = useState([
        '#FFFFFF',
        '#A0A0A0',
        '#646464',
        '#505050',
        '#000000',

        '#D3AC8B',
        '#B58E6D',
        '#8D6645',
        '#512A09',
        '#330C00',

        '#65B9FF',
        '#16E2F5',
        '#14D3FF',
        '#1569C7',
        '#0B5FBD',

        '#00FF00',
        'pink',
        'yellow',
        'orange',
        'red',
    ]);

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }))
    }

    async function handleCameraImage() {

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setState({ photo: result });
        }
    };

    async function handleGalleryImage() {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setState({ photo: result });
        }
    };

    function handleSubmit() {

        let data = {
            name: state.name.trim(),
            animal: state.animal.trim(),
            kind: state.kind.trim(),
            photo: state.photo,
            age: state.age.trim(),
            description: state.description.trim(),
            gender: state.gender,
            color: state.color
        }

        if (data.name != '' &&
            data.animal != '' &&
            data.kind != '' &&
            data.photo != '' &&
            data.age != '' &&
            data.description != '') {

            let uri = state.photo.uri;
            let name = uri.split('/').pop();
            let match = /\.(\w+)$/.exec(name);
            let type = match ? `image/${match[1]}` : `image`;

            let reqBody = new FormData();
            reqBody.append('name', data.name);
            reqBody.append('animal', data.animal);
            reqBody.append('kind', data.kind);
            reqBody.append('gender', data.gender);
            reqBody.append('age', data.age);
            reqBody.append('color', data.color);
            reqBody.append('description', data.description);
            reqBody.append('date', new Date().toString());
            reqBody.append('_User', _id);
            reqBody.append('fileSrc', { uri, name, type });

            API.post(`blogs`, reqBody)
                .then(res => {
                    const success = res.data.success;
                    if (success) navigation.goBack();
                });
        } else (setState({ validPost: false }))
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Animatable.View
                    useNativeDriver={true}
                    animation='fadeInUpBig'
                >
                    <View style={styles.subContainer}>
                        <View style={styles.actionImage}>
                            {state.photo == '' ?
                                <FontAwesome
                                    name='question'
                                    color='#D2B48C'
                                    size={100}
                                    style={{
                                        width: 200,
                                        height: 200,
                                        padding: 20,
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        borderRadius: 30,
                                        borderWidth: 5,
                                        borderColor: '#D2B48C'
                                    }}
                                />
                                :
                                < Image
                                    style={{
                                        width: 200,
                                        height: 200,
                                        borderRadius: 30
                                    }}
                                    source={{ uri: state.photo.uri }}
                                />
                            }

                            <View style={styles.actionImageIcon}>
                                <TouchableOpacity onPress={handleCameraImage}>
                                    <FontAwesome
                                        name='camera'
                                        color='#D2B48C'
                                        size={24}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleGalleryImage}>
                                    <FontAwesome
                                        name='picture-o'
                                        color='#D2B48C'
                                        size={24}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.action}>
                            <FontAwesome
                                name='user'
                                color='#D2B48C'
                                size={24}
                                style={styles.iconWidth}
                            />
                            <TextInput
                                placeholder='Name'
                                value={state.name}
                                onChangeText={(val) => setState({ name: val })}
                                style={styles.textInput}
                            />
                        </View>

                        <View style={styles.action}>
                            <FontAwesome
                                name='paint-brush'
                                color='#D2B48C'
                                size={24}
                                style={styles.iconWidth}
                                onPress={() => setState({ showColor: !state.showColor })}
                            />

                            {state.showColor ?
                                <NativeColorPicker
                                    colors={colors}
                                    selectedColor={state.color}
                                    itemSize={30}
                                    // horizontal={true}
                                    animate="scale"
                                    shadow
                                    markerType="checkmark"
                                    markerDisplay="color"
                                    onSelect={val => setState({ color: val, showColor: false })}
                                />
                                :
                                <TouchableOpacity onPress={() => setState({ showColor: !state.showColor })}>
                                    <View
                                        style={{
                                            width: 100,
                                            borderRadius: 10,
                                            height: 20,
                                            backgroundColor: state.color,
                                            borderWidth: 1,
                                            borderColor: state.color == '#FFFFFF' ? '#D2B48C' : 'transparent'
                                        }}
                                    />
                                </TouchableOpacity>
                            }
                        </View>

                        <View style={styles.action}>
                            <FontAwesome
                                name='gg-circle'
                                color='#D2B48C'
                                size={24}
                                style={styles.iconWidth}
                            />
                            <TextInput
                                placeholder='Kind of animal'
                                value={state.animal}
                                onChangeText={(val) => setState({ animal: val })}
                                style={styles.textInput}
                            />
                        </View>

                        <View style={styles.action}>
                            <FontAwesome
                                name='paw'
                                color='#D2B48C'
                                size={24}
                                style={styles.iconWidth}
                            />
                            <TextInput
                                placeholder='Breed'
                                value={state.kind}
                                onChangeText={(val) => setState({ kind: val })}
                                style={styles.textInput}
                            />
                        </View>

                        <View style={styles.action}>
                            <FontAwesome
                                name='child'
                                color='#D2B48C'
                                size={24}
                                style={styles.iconWidth}
                            />
                            <TextInput
                                keyboardType='numeric'
                                placeholder='Age'
                                value={state.age}
                                onChangeText={(val) => setState({ age: val })}
                                style={styles.textInput}
                            />
                        </View>

                        <View style={styles.action}>
                            <FontAwesome
                                name='venus-mars'
                                color='#D2B48C'
                                size={24}
                                style={styles.iconWidth}
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

                        <View style={styles.action}>
                            <FontAwesome
                                name='pencil-square-o'
                                color='#D2B48C'
                                size={24}
                                style={styles.iconWidth}
                            />
                            <TextInput
                                placeholder='Description'
                                value={state.description}
                                onChangeText={(val) => setState({ description: val })}
                                style={styles.textInput}
                            />
                        </View>

                        {state.validPost ? null :
                            < Animatable.View animation='fadeInLeft' duration={500} useNativeDriver={true}>
                                <Text style={styles.errorMsg}>Please Fill in all Required Fields.</Text>
                            </Animatable.View>
                        }

                        <View style={styles.styleButton}>
                            <Button
                                title='Create'
                                color='#D2B48C'
                                onPress={handleSubmit}
                            />
                        </View>

                    </View>

                </Animatable.View >

            </View >
        </ScrollView>
    )
}

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    subContainer: {
        paddingHorizontal: 20,
        paddingVertical: 5
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionImage: {
        flexDirection: 'column',
        marginTop: 10,
        paddingBottom: 5,
        alignItems: 'center'
    },
    actionImageIcon: {
        width: 200,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        paddingBottom: 5,
    },
    textInput: {
        width: '80%',
        marginTop: Platform.OS === 'ios' ? 0 : -5,
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
    },
    stretch: {
        width: 50,
        height: 200,
        resizeMode: 'stretch',
    },
    iconWidth: {
        width: 40
    },
    styleButton: {
        padding: 30
    }
});