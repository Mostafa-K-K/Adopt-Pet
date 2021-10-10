import React, { useState, useEffect, useContext, useCallback } from 'react';

import {
  View,
  Text,
  Button,
  Modal,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';

import API from '../../API';
import moment from 'moment';
import { get } from 'lodash';
import { useFocusEffect } from '@react-navigation/native';
import SessionContext from '../../components/SessionContext';

export default function RequestsSenderScreen({ navigation }) {

  const { session: { user: { _id } } } = useContext(SessionContext);

  const [state, updateState] = useState({
    requests: [],

    user: '',
    getUser: false,

    requestSelected: '',
    confirmDelete: false,
    confirmRequest: false
  });

  function setState(nextState) {
    updateState(prevState => ({
      ...prevState,
      ...nextState
    }))
  }

  function handleRmoveRequest() {
    API.delete(`requests/${state.requestSelected}`)
      .then(res => {
        const success = res.data.success;
        if (success) {
          setState({ requestSelected: '', confirmRequest: false, confirmDelete: false });
          fetchData();
        }
      })
  }

  async function getUserData(user_id) {
    await API.get(`users/${user_id}`)
      .then(res => {
        const success = res.data.success;
        if (success) {
          const data = res.data.result;
          setState({ user: data });
          setState({ getUser: true });
        }
      })
  }

  function fetchData() {
    API.post(`getBySender/${_id}`)
      .then(res => {
        const success = res.data.success;
        if (success) {
          const result = res.data.result;
          if (result) setState({ requests: result });
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
    !state.requests.length ?
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

          {state.requests.map(request =>
            <View
              style={styles.divCard}
              key={request._id}
            >
              <Image
                style={styles.stylePic}
                source={{ uri: `http://192.168.43.79:8000/uploads/${request._Blog.photo}` }}
              />

              <View style={styles.styleInfo}>
                <Text>Animal : {request._Blog.animal}, {request._Blog.kind}</Text>
                <Text>Name : {request._Blog.name}</Text>
                <Text>Age : {request._Blog.age}</Text>
                <Text>Gender : {request._Blog.gender}</Text>
                <Text>Color : {request._Blog.color}</Text>
              </View>

              <View style={styles.styleAction}>
                {request.status == 'Waiting' ?
                  <TouchableOpacity onPress={() => setState({ requestSelected: request._id, confirmRequest: true })}>
                    <Icon
                      name='close-sharp'
                      color='#D11A2A'
                      size={40}
                    />
                  </TouchableOpacity>
                  : null}
                {request.status == 'Accepted' ?
                  <TouchableOpacity onPress={() => getUserData(request._Receiver._id)}>
                    <Icon
                      name='person-circle-outline'
                      color='#D2B48C'
                      size={40}
                    />
                  </TouchableOpacity>
                  : null}

                {request.status == 'Rejected' || request.status == 'Accepted' ?
                  <TouchableOpacity onPress={() => setState({ requestSelected: request._id, confirmRequest: true, confirmDelete: true })}>
                    <Icon
                      name='trash-outline'
                      color='#D11A2A'
                      size={40}
                    />
                  </TouchableOpacity>
                  : null}
              </View>

            </View>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={state.confirmRequest}
            onRequestClose={() => {
              setState({ confirmRequest: false, confirmDelete: false });
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{state.confirmDelete ? 'Delete' : 'Remove'} Request?</Text>

                <View style={{ width: width / 2, margin: 5 }}>
                  <Button
                    title={state.confirmDelete ? 'Delete' : 'Remove'}
                    color='#D11A2A'
                    onPress={handleRmoveRequest}
                  />
                </View>

                <View style={{ width: width / 2, margin: 5 }}>
                  <Button
                    title='Cancel'
                    color='#D2B48C'
                    onPress={() => setState({ confirmRequest: false, confirmDelete: false })}
                  />
                </View>

              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={state.getUser}
            onRequestClose={() => {
              setState({ getUser: false });
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Contact {get(state.user, 'firstName')} {get(state.user, 'lastName')}</Text>
                <Text>Phone Number : {get(state.user, 'phone')}</Text>
                <Text>Address : {get(state.user, 'address')}</Text>
                <Text>Age : {moment(get(state.user, 'birthDate')).fromNow('Maria')}</Text>

                <View style={[{ width: width / 2, margin: 5 }]}>
                  <Button
                    title='Ok'
                    color='#D2B48C'
                    onPress={() => setState({ getUser: false })}
                  />
                </View>

              </View>
            </View>
          </Modal>


        </ScrollView>
      </View>
  )
}

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  containerEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
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
  divCard: {
    width: width,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stylePic: {
    width: width / 3.2,
    height: width / 3.2,
    borderRadius: 5,
    alignSelf: 'center'
  },
  styleInfo: {
    width: width / 3,
    textAlign: 'left',
    paddingLeft: 10,
    alignSelf: 'center'
  },
  styleAction: {
    width: width / 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center'
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
});