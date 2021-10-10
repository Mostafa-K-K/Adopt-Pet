import React, { useState, useEffect, useCallback } from 'react';

import {
    View,
    Text,
    Image,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import API from '../../API';

export default function PostsScreen({ navigation }) {

    const [posts, setPosts] = useState([])

    async function fetchData() {
        await API.get(`/blogsAll`)
            .then(res => {
                const success = res.data.success;
                if (success) {
                    const result = res.data.result;
                    setPosts(result)
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
        !posts.length ?
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
            :
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.listBlogs}>
                        {posts.map(post =>
                            <TouchableOpacity
                                key={post._id}
                                style={styles.blog}
                                onPress={() => navigation.navigate('infopostuser', { _Post: post._id })}
                            >
                                <Image
                                    style={{ width: width / 3, height: width / 3 }}
                                    source={{ uri: `http://192.168.43.79:8000/uploads/${post.photo}` }}
                                />

                            </TouchableOpacity>
                        )
                        }
                    </View>
                </ScrollView>
            </View>
    )
}

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    containerEmpty: {
        flex: 1,
        alignItems: 'center',
        marginTop: 60
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
    listBlogs: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    blog: {
        width: width / 3,
    },
    styleTextProfile: {
        padding: 10,
        height: width / 1.8,
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