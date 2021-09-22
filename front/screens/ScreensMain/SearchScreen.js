import React, { useEffect, useState } from 'react';
import API from '../../API';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SearchScreen(props) {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    function fetchData() {
      API.post(`blogsfilter`, { name: props.name })
        .then(res => {
          const success = res.data.success;
          console.log(res.data);
          if (success) {
            const result = res.data.result;
            setPosts(result)
          }
        });
    }
    fetchData();
  }, [props.name]);

  return (
    <View style={styles.container}>
      {!posts.length ?
        <Animatable.View
          style={styles.container}
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
        >
          <Icon
            name='ios-search'
            size={25}
            style={styles.icon}
          />
          <Text
            style={[styles.icon, { fontSize: 24 }]}
          >
            &nbsp; &nbsp; Search ...
          </Text>
        </Animatable.View>
        :
        <View>
          {posts.map(post =>
            <View key={post._id}>
              <Text key={post._id}>
                {post.name} , {post.animal} , {post.kind} , {post.gender} , {post.description}
              </Text>
            </View>
          )}
        </View>

      }

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF'
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'rgba(0,0,0,0.3)',
    fontSize: 35.
  }
});