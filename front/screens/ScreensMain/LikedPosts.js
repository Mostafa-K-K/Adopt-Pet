import React, { useState, useContext, useEffect, useMemo } from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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

    useEffect(() => {
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
                                    })
                                    console.log(arr);
                                    setPosts(arr);
                                }
                            });

                    }
                });


        }
        fetchData();
    }, [actionLike])

    return (
        <View style={styles.container}>
            {!posts.length ?
                <Text>no result</Text> :
                posts.map(post =>
                    <View key={post._id}>
                        <Text key={post._id}>
                            {post.name} , {post.animal} , {post.kind} , {post.gender} , {post.description}
                        </Text>
                        < FontAwesome
                            name='heart'
                            onPress={() => handleUnlike(post._id)}
                        />
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
});