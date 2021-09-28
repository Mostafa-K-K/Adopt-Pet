import React, { useState, useEffect, useContext } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import API from '../../API';
import SessionContext from '../../components/SessionContext';

export default function RequestsReceiverScreen() {

  const { session: { user: { _id } } } = useContext(SessionContext);

  const [requests, setRequests] = useState([]);

  function handleResponse(id, value) {
    API.put(`requests/${id}`, { status: value })
      .then(res => {
        const success = res.data.success;
        if (success) {
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
          setRequests(result);
        }
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (!requests.length ?
    <View style={styles.containerEmpty}>
      <Text>No Requests!</Text>
    </View>
    :
    <View style={styles.container}>
      {requests.map(request =>
        <View key={request._id}>
          <Text>{request._Blog.name}</Text>

          <TouchableOpacity onPress={() => handleResponse(request._id, 'Accepted')}>
            <Icon
              name='checkmark-sharp'
              color='#D2B48C'
              size={30}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleResponse(request._id, 'Rejected')}>
            <Icon
              name='close-sharp'
              color='#FF0000'
              size={30}
            />
          </TouchableOpacity>

        </View>
      )}
    </View>
  )
}

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
});