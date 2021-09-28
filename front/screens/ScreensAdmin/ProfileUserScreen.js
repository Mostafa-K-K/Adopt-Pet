import React, { useState, useEffect, useContext, useCallback } from 'react';

import {
  View,
  Text,
  Image,
  Button,
  Alert,
  Modal,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { get } from 'lodash';
import moment from 'moment';
import API from '../../API';

export default function ProfileUserScreen(props) {

  const _User = get(props.route.params, '_User');

  const [state, updateState] = useState({
    posts: [],

    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    birthDate: "",
    username: "",

    confirmDelete: false
  });

  function setState(nextState) {
    updateState(prevState => ({
      ...prevState,
      ...nextState
    }))
  }

  function handleDelete() {
    API.delete(`users/${_User}`)
      .then(res => {
        const success = res.data.success;
        if (success) {
          setState({ confirmDelete: false })
          props.navigation.goBack()
        };
      })
  }

  function fetchData() {

    API.get(`users/${_User}`)
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
            username: result.username,
          });
        }
      });

    API.get(`/blogsuser/${_User}`)
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
            title='Dlete User'
            onPress={() => setState({ confirmDelete: true })}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={state.confirmDelete}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setState({ confirmDelete: !state.confirmDelete });
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Delete post?</Text>

              <View style={[{ width: width / 2, margin: 5 }]}>
                <Button
                  title='Delete'
                  color='#FF0000'
                  onPress={handleDelete}
                />
              </View>

              <View style={[{ width: width / 2, margin: 5 }]}>
                <Button
                  title='Cancel'
                  color='#D2B48C'
                  onPress={() => setState({ confirmDelete: false })}
                />
              </View>

            </View>
          </View>
        </Modal>


        <View style={styles.listBlogs}>
          {state.posts.map(post =>
            <TouchableOpacity
              key={post._id}
              style={styles.blog}
              onPress={() => props.navigation.navigate('infopostuser', { _Post: post._id })}
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
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 15
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});