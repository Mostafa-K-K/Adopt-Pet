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

import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import moment from 'moment';
import API from '../../API';
import SessionContext from '../../components/SessionContext';

export default function LikedPosts() {

    const { session: { user: { _id } } } = useContext(SessionContext);

    const [posts, setPosts] = useState([]);

    const [actionLike, setActionLike] = useState(true);

    function handleUnlike(post_id) {
        let reqBody = {
            _User: _id,
            _Blog: post_id
        }
        API.post(`unlike`, reqBody)
            .then(setActionLike(!actionLike))
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
                                setPosts(arr);
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
    }, [actionLike]);

    return (
        <View style={styles.container}>
            <ScrollView>
                {!posts.length ?
                    <Text>no result</Text>
                    :
                    posts.map(post =>
                        <Card style={styles.cartStyle}>
                            <View key={post._id}>

                                <Card.Content>
                                    <Title>{post.animal} &nbsp; {post.kind}</Title>
                                    <Paragraph>Published on {moment(post.date).fromNow()}</Paragraph>
                                </Card.Content>

                                <Image
                                    style={{ width: width, height: width }}
                                    source={{ uri: `http://192.168.43.79:8000/uploads/${post.photo}` }}
                                />

                                <Card.Content>
                                    <Card.Content>
                                        <View>
                                            <Text>Name : {post.name}</Text>
                                            <Text>Gender : {post.gender}</Text>
                                            <Text>Age : {post.age}</Text>
                                            <Text>Color : </Text>
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
                                            <Text>{post.description}</Text>
                                        </View>
                                    </Card.Content>
                                </Card.Content>

                                < FontAwesome
                                    name='heart'
                                    size={24}
                                    color='#D2B48C'
                                    onPress={() => handleUnlike(post._id)}
                                />

                            </View>
                        </Card>
                    )
                }
            </ScrollView >
        </View>
    )
}

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
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