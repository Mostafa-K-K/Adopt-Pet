import React, { useState, useContext, useEffect, useCallback } from 'react';

import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    ScrollView
} from 'react-native';

import {
    Card,
    Title,
    Paragraph
} from 'react-native-paper';

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import moment from 'moment';
import API from '../../API';
import SessionContext from '../../components/SessionContext';

export default function LikedPosts() {

    const { session: { user: { _id } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        posts: [],
        actionLike: true
    });

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }))
    }

    function handleLike(post_id) {
        let reqBody = {
            _User: _id,
            _Blog: post_id
        }

        API.post(`like`, reqBody)
            .then(res => {
                const success = res.data.success;
                if (success) {
                    setState({ actionLike: !state.actionLike });
                }
            });
    }

    function handleUnlike(post_id) {
        let reqBody = {
            _User: _id,
            _Blog: post_id
        }

        API.post(`unlike`, reqBody)
            .then(res => {
                const success = res.data.success;
                if (success) {
                    setState({ actionLike: !state.actionLike });
                };
            });
    }

    function fetchData() {
        API.get(`likes`)
            .then(async res => {
                const success = res.data.success;
                if (success) {
                    const likes = res.data.result;

                    await API.get(`blogs`)
                        .then(resp => {
                            const success = resp.data.success;
                            if (success) {
                                const blogs = resp.data.result;
                                let arr = [];
                                likes.map(l => {
                                    let blog = blogs.find(b => b._id == l._Blog && l._User == _id)
                                    if (blog) arr.push(blog);
                                });
                                setState({ posts: arr })
                            }
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
    }, [state.actionLike]);

    return (
        !state.posts.length ?
            <Animatable.View
                style={styles.containerEmpty}
                animation="pulse"
                easing="ease-out"
                iterationCount="infinite"
            >
                <Icon
                    name='paw-outline'
                    size={25}
                    style={styles.icon}
                />
                <Text
                    style={[styles.icon, { fontSize: 24 }]}
                >
                    &nbsp; &nbsp; No Likes
                </Text>
            </Animatable.View>
            :
            <View style={styles.container}>
                <ScrollView>
                    {state.posts.map(post =>
                        <Card
                            key={post._id}
                            style={styles.cartStyle}
                        >
                            <Card.Content>
                                <Title>{post.animal} &nbsp; {post.kind}</Title>
                                <Paragraph>Published on {moment(new Date(post.date)).fromNow()}</Paragraph>
                            </Card.Content>

                            <Image
                                style={{ width: width, height: width }}
                                source={{ uri: `http://192.168.43.79:8000/uploads/${post.photo}` }}
                            />

                            <Card.Content>
                                <Card.Content>
                                    <View>
                                        <View style={styles.flexRowView}>
                                            <Text style={styles.boldTextStyle}>Name : </Text>
                                            <Text>{post.name}</Text>
                                        </View>

                                        <View style={styles.flexRowView}>
                                            <Text style={styles.boldTextStyle}>Gender : </Text>
                                            <Text>{post.gender}</Text>
                                        </View>

                                        <View style={styles.flexRowView}>
                                            <Text style={styles.boldTextStyle}>Age : </Text>
                                            <Text>{post.age} months</Text>
                                        </View>

                                        <View style={styles.flexRowView}>
                                            <Text style={styles.boldTextStyle}>Color : </Text>
                                            <View
                                                style={{
                                                    backgroundColor: post.color,
                                                    height: 15,
                                                    width: 30,
                                                    borderRadius: 10,
                                                    borderWidth: 1,
                                                    borderColor: post.color == '#FFFFFF' ? '#D2B48C' : 'transparent'
                                                }}
                                            />
                                        </View>

                                        <Text>{post.description}</Text>
                                    </View>

                                    <Icon
                                        name='paw'
                                        size={35}
                                        color='#D11A2A'
                                        onPress={() => handleUnlike(post._id)}
                                        style={styles.likeStyle}
                                    />

                                </Card.Content>
                            </Card.Content>


                        </Card>
                    )}
                </ScrollView >
            </View>
    )
}

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
    containerEmpty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF'
    },
    flexRowView: {
        flexDirection: 'row',
    },
    boldTextStyle: {
        fontWeight: 'bold',
        marginRight: 5
    },
    likeStyle: {
        position: 'absolute',
        top: 15,
        right: 0
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    icon: {
        backgroundColor: 'transparent',
        color: 'rgba(0,0,0,0.3)',
        fontSize: 35.
    },
    cartStyle: {
        shadowOffset: { width: 10, height: 10 },
        width: width,
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 15
    },
});