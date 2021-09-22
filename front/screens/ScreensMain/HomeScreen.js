import React, { useState, useEffect, useContext, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  FlatList
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import API from '../../API';
import SessionContext from '../../components/SessionContext';

export default function HomeScreen() {

  const { session: { user: { _id } } } = useContext(SessionContext);

  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  function handleLike(post_id) {
    // let like = likes;
    // like[post_id] = true;
    // setLikes(like);

    let reqBody = {
      _User: _id,
      _Blog: post_id
    }

    API.post(`like`, reqBody)
      .then(res => {
        const success = res.data.success;
        console.log(res.data);
        // if (!success) setLikes({ ...likes, post_id: false });
      });
  }

  function handleUnlike(post_id) {
    // let like = likes;
    // like[post_id] = false;
    // setLikes(like);

    let reqBody = {
      _User: _id,
      _Blog: post_id
    }

    API.post(`unlike`, reqBody)
      .then(res => {
        console.log(res);
        const success = res.data.success;
        // if (!success) setLikes({ ...likes, post_id: true });
      });
  }

  function fetchData() {
    API.get(`blogs`)
      .then(res => {
        const success = res.data.success;
        if (success) {
          const blogs = res.data.result;
          setPosts(blogs);
          API.get(`likes`)
            .then(res => {
              const success = res.data.success;
              if (success) {
                const likes = res.data.result;
                let arr = {};
                blogs.map(b => {
                  let isLiked = likes.find(l => l._Blog == b._id);
                  isLiked ? arr[b._id] = true : arr[b._id] = false;
                });
                setLikes(arr);
              }
            });
        }
      });
  }

  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);

  //   wait(2000).then(() => setRefreshing(false));
  // }, []);


  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View
      style={styles.container}
    >


      {!posts.length ?
        <Text>no result</Text> :
        posts.map(post =>
          <View key={post._id}>
            <Text key={post._id}>
              {post.name}, {post.animal}, {post.kind}, {post.gender}, {post.description}
            </Text>
            {likes[post._id] ?
              < FontAwesome
                name='heart'
                size={24}
                color='#D2B48C'
                onPress={() => handleUnlike(post._id)}
              />
              :
              <FontAwesome
                name='heart-o'
                size={24}
                color='#D2B48C'
                onPress={() => handleLike(post._id)}
              />
            }
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  heart: {}
});