import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SearchScreen() {

  const [posts, setPosts] = useState([]);

  useEffect(() => { }, [])

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

        : <Text>Posts</Text>
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
    backgroundColor:'#FFFFFF'
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'rgba(0,0,0,0.3)',
    fontSize: 35.
  }
});