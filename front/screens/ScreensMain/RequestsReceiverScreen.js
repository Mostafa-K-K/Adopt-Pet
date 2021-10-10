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
import { useFocusEffect } from '@react-navigation/native';
import SessionContext from '../../components/SessionContext';

export default function RequestsReceiverScreen() {

  const { session: { user: { _id } } } = useContext(SessionContext);

  const [state, updateState] = useState({
    requests: [],

    requestSelected: '',
    confirmAccept: false,
    confirmReject: false
  });

  function setState(nextState) {
    updateState(prevState => ({
      ...prevState,
      ...nextState
    }))
  }

  function handleAcceptRequest() {
    API.put(`requests/${state.requestSelected}`, { status: 'Accepted' })
      .then(res => {
        const success = res.data.success;
        if (success) {
          setState({ requestSelected: '', confirmAccept: false });
          fetchData();
        }
      })
  }

  function handleRejectRequest() {
    API.put(`requests/${state.requestSelected}`, { status: 'Rejected' })
      .then(res => {
        const success = res.data.success;
        if (success) {
          setState({ requestSelected: '', confirmReject: false });
          fetchData();
        }
      })
  }

  function fetchData() {
    API.post(`getByReceiver/${_id}`, { status: 'Waiting' })
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
                <Text style={{ fontWeight: 'bold' }}>{request._Blog.animal} {request._Blog.kind} {request._Blog.name}</Text>
                <Text>{request._Sender.firstName}, {request._Sender.lastName}</Text>
                <Text>Phone Number : {request._Sender.phon}</Text>
                <Text>Address : {request._Sender.address}</Text>
                <Text>Gender : {request._Sender.gender}</Text>
                <Text>Age : {moment(request._Sender.birthDate).fromNow('Maria')}</Text>
              </View>

              <View style={styles.styleAction}>
                <TouchableOpacity onPress={() => setState({ requestSelected: request._id, confirmAccept: true })}>
                  <Icon
                    name='checkmark-circle'
                    color='#D2B48C'
                    size={40}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginTop: 15 }}
                  onPress={() => setState({ requestSelected: request._id, confirmReject: true })}
                >
                  <Icon
                    name='md-close-circle'
                    color='#D11A2A'
                    size={40}
                  />
                </TouchableOpacity>
              </View>

            </View>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={state.confirmAccept}
            onRequestClose={() => {
              setState({ confirmAccept: false });
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Accept Request?</Text>

                <View style={{ width: width / 2, margin: 5 }}>
                  <Button
                    title='Accept'
                    color='#D2B48C'
                    onPress={handleAcceptRequest}
                  />
                </View>

                <View style={{ width: width / 2, margin: 5 }}>
                  <Button
                    title='Cancel'
                    color='#D2B48C'
                    onPress={() => setState({ confirmAccept: false })}
                  />
                </View>

              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={state.confirmReject}
            onRequestClose={() => {
              setState({ confirmReject: false });
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Reject Request?</Text>

                <View style={{ width: width / 2, margin: 5 }}>
                  <Button
                    title='Reject'
                    color='#D11A2A'
                    onPress={handleRejectRequest}
                  />
                </View>

                <View style={{ width: width / 2, margin: 5 }}>
                  <Button
                    title='Cancel'
                    color='#D2B48C'
                    onPress={() => setState({ confirmReject: false })}
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
    width: width / 2,
    textAlign: 'left',
    paddingLeft: 10,
    alignSelf: 'center'
  },
  styleAction: {
    flexDirection: 'column',
    alignContent: 'space-around',
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