import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';

import {
  View,
  Text,
  Button,
  Alert,
  Modal,
  Dimensions,
  StyleSheet
} from 'react-native';

import API from '../../API';
import SessionContext from '../../components/SessionContext';

export default function RequestsSenderScreen({ navigation }) {

  const { session: { user: { _id } } } = useContext(SessionContext);

  const [state, updateState] = useState({
    requests: [],

    confirmDelete: false,
    confirmRequest: false,
    requestSelected: ''
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

  function fetchData() {
    API.post(`getBySender/${_id}`)
      .then(res => {
        const success = res.data.success;
        if (success) {
          const result = res.data.result;
          setState({ requests: result })
        }
      });
  }

  useEffect(() => {
    fetchData();
  }, []);


  return (!state.requests.length ?
    <View style={styles.containerEmpty}>
      <Text>No Requests!</Text>
    </View>
    :
    <View style={styles.container}>
      {state.requests.map(request =>
        <View key={request._id}>
          <Text>{request._Blog.name}</Text>

          {request.status == 'Waiting' ?
            <Button
              title="Remove"
              onPress={() => setState({ requestSelected: request._id, confirmRequest: true })}
            />
            :
            request.status != 'Rejected' ?
              <Button
                title="Delete"
                onPress={() => setState({ requestSelected: request._id, confirmRequest: true, confirmDelete: true })}
              />
              :
              request.status == 'Accepted' ?
                <Button
                  title="Contact"
                  onPress={() => navigation.navigate('contactuserinfo')}
                />
                : null
          }

        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={state.confirmRequest}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setState({ confirmRequest: !state.confirmRequest });
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{state.confirmDelete ? 'Delete' : 'Remove'} Request?</Text>

            <View
              style={[{
                width: width / 2,
                margin: 5,
              }]}
            >
              <Button
                title={state.confirmDelete ? 'Delete' : 'Remove'}
                color='#D2B48C'
                onPress={handleRmoveRequest}
              />
            </View>

            <View style={[{ width: width / 2, margin: 5 }]}>
              <Button
                title='Cancel'
                color='#D2B48C'
                onPress={() => setState({ confirmRequest: false, confirmDelete: false })}
              />
            </View>

          </View>
        </View>
      </Modal>

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
});