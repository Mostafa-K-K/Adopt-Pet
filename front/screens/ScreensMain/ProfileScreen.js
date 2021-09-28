import React, { useState, useEffect, useContext, useCallback } from 'react';

import {
  View,
  Text,
  Image,
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import moment from 'moment';
import API from '../../API';
import SessionContext from '../../components/SessionContext';

export default function ProfileScreen({ navigation }) {

  const { session: { user: { _id } } } = useContext(SessionContext);

  const [state, updateState] = useState({
    posts: [],

    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    birthDate: "",
    username: ""
  });

  function setState(nextState) {
    updateState(prevState => ({
      ...prevState,
      ...nextState
    }))
  }

  function fetchData() {

    API.get(`users/${_id}`)
      .then(res => {
        const success = res.data.success;
        if (success) {
          const result = res.data.result;
          setState({
            firstName: result.firstName,
            lastName: result.lastName,
            phone: result.phone,
            address: result.address,
            birthDate: result.birthDate,
            username: result.username
          });
        }
      });

    API.get(`/blogsuser/${_id}`)
      .then(res => {
        const success = res.data.success;
        if (success) {
          const result = res.data.result;
          setState({
            posts: result
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
  }, []);

  return (
    <View style={styles.container}>

      <ScrollView>
        <View>
          <Text>Username : {state.username}</Text>
          <Text>Name : {state.firstName} {state.lastName}</Text>
          <Text>Phone Number : {state.phone}</Text>
          <Text>Address : {state.address}</Text>
          <Text>Birth Date : {moment(state.birthDate).format('D   MMMM   YYYY')}</Text>
          <Button
            title='Edit Profile'
            onPress={() => navigation.navigate('editprofile')}
          />
        </View>

        <View style={styles.listBlogs}>
          {state.posts.map(post =>
            <TouchableOpacity
              key={post._id}
              style={styles.blog}
              onPress={() => navigation.navigate('infopost', { _Post: post._id })}
            >
              <Image
                style={{ width: width / 3, height: width / 3 }}
                source={{ uri: `http://192.168.43.79:8000/uploads/${post.photo}` }}
              />

            </TouchableOpacity>
          )}
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
  listBlogs: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  blog: {
    width: width / 3,
  }
});