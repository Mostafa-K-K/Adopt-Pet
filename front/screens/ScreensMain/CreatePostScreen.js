import React, { useState, useContext } from 'react';

import {
    View,
    Text,
    Image,
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
        gender: '',
        age: '',
        color: 'white',
        description: '',

        showColor: false
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

        console.log(result);

        if (!result.cancelled) {
            setState({ photo: result });
        }
    };

    function handleSubmit() {
        let uri = state.photo.uri;
        let name = uri.split('/').pop();
        let match = /\.(\w+)$/.exec(name);
        let type = match ? `image/${match[1]}` : `image`;

        let reqBody = new FormData();
        reqBody.append('name', state.name.trim());
        reqBody.append('animal', state.animal.trim());
        reqBody.append('kind', state.kind.trim());
        reqBody.append('gender', state.gender);
        reqBody.append('age', state.age);
        reqBody.append('color', state.color);
        reqBody.append('description', state.description);
        reqBody.append('date', new Date());
        reqBody.append('_User', _id);
        reqBody.append('fileSrc', { uri, name, type });

        API.post(`blogs`, reqBody)
            .then(navigation.goBack())
    }

    return (
        <View style={styles.container}>
            <Animatable.View
                animation='fadeInUpBig'
            >
                <ScrollView>
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
                                source={{
                                    uri: state.photo.uri,
                                }}
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
                            placeholder='Animal'
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
                            placeholder='Kind'
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

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={handleSubmit}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Create</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </Animatable.View>
        </View>
    )
}

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
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
        paddingBottom: 5,
        width: width
    },
    actionImage: {
        flexDirection: 'column',
        marginTop: 10,
        paddingBottom: 5,
    },
    actionImageIcon: {
        width: 200,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -5,
        paddingLeft: 0,
        color: '#000000'
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
    },
    stretch: {
        width: 50,
        height: 200,
        resizeMode: 'stretch',
    },
    iconWidth: {
        width: 40
    }
});