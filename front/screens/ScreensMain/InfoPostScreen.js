import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  Button
} from 'react-native';
import API from '../../API';

export default function InfoPostScreen(props) {
  console.log(props);
  const _Post = props.route.params._Post;

  const [state, updateState] = useState({
    post: '',
  });

  function setState(nextState) {
    updateState(prevState => ({
      ...prevState,
      ...nextState
    }))
  }

  function handleDelete() {
    API.delete(`blogs/${_Post}`)
      .then(props.navigation.goBack())
  }

  function fetchData() {
    API.get(`blogs/${_Post}`)
      .then(res => {
        const success = res.data.success;
        if (success) {
          const result = res.data.result;
          setState({ post: result });
        }
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Animal: {state.post.animal}</Text>
      <Text>Kind: {state.post.Kind}</Text>
      <Text>Name: {state.post.name}</Text>
      <Text>Color: {state.post.color}</Text>
      <Text>Description: {state.post.description}</Text>
      <Text>Gender: {state.post.gender}</Text>
      {state.post.photo && state.post.photo != '' ?
        <Image
          style={{ width: 200, height: 200 }}
          source={{ uri: `http://192.168.43.79:8000/uploads/${state.post.photo}` }}
        />
        :
        null
      }

      <Button
        title='delete'
        onPress={handleDelete}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
});