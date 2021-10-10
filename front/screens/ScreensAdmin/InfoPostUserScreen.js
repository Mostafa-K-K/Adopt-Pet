import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Alert,
  Modal,
  ScrollView,
  Dimensions
} from 'react-native';

import {
  Card,
  Title,
  Paragraph
} from 'react-native-paper';

import moment from 'moment';
import API from '../../API';
import { get } from 'lodash';

export default function InfoPostUserScreen(props) {

  const _Post = get(props.route.params, '_Post');

  const [state, updateState] = useState({
    name: '',
    animal: '',
    kind: '',
    photo: '',
    gender: '',
    age: '',
    color: '',
    description: '',
    available: '',
    date: new Date(),

    confirmDelete: false
  });

  function setState(nextState) {
    updateState(prevState => ({
      ...prevState,
      ...nextState
    }))
  }

  function handleDelete() {
    API.delete(`blogs/${_Post}`)
      .then(res => {
        const success = res.data.success;
        if (success) {
          setState({ confirmDelete: false });
          props.navigation.goBack();8
        };
      })
  }

  function fetchData() {
    API.get(`blogs/${_Post}`)
      .then(res => {
        const success = res.data.success;
        if (success) {
          const result = res.data.result;
          setState({
            name: result.name,
            animal: result.animal,
            kind: result.kind,
            photo: result.photo,
            gender: result.gender,
            age: result.age,
            color: result.color,
            description: result.description,
            available: result.available ? 'Activate' : 'Deactivate',
            date: result.date
          });
        }
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>

        <Card.Content>
          <Title>{state.animal} &nbsp; {state.kind}</Title>
          <Paragraph>Published on {moment(new Date(state.date)).fromNow()}</Paragraph>
        </Card.Content>

        <Image
          style={{ width: width, height: width }}
          source={{ uri: `http://192.168.43.79:8000/uploads/${state.photo}` }}
        />

        <Card.Content>
          <View>
            <View style={styles.flexRowView}>
              <Text style={styles.boldTextStyle}>Kind of animal : </Text>
              <Text>{state.animal}</Text>
            </View>

            <View style={styles.flexRowView}>
              <Text style={styles.boldTextStyle}>Breed of animal : </Text>
              <Text>{state.kind}</Text>
            </View>

            <View style={styles.flexRowView}>
              <Text style={styles.boldTextStyle}>Status : </Text>
              <Text>{state.available}</Text>
            </View>

            <View style={styles.flexRowView}>
              <Text style={styles.boldTextStyle}>Name : </Text>
              <Text>{state.name}</Text>
            </View>


            <View style={styles.flexRowView}>
              <Text style={styles.boldTextStyle}>Gender : </Text>
              <Text>{state.gender}</Text>
            </View>


            <View style={styles.flexRowView}>
              <Text style={styles.boldTextStyle}>Age : </Text>
              <Text>{state.age}</Text>
            </View>

            <View style={styles.flexRowView}>
              <Text style={styles.boldTextStyle}>Color : </Text>
              <View
                style={{
                  backgroundColor: state.color,
                  height: 15,
                  width: 30,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: state.color == '#FFFFFF' ? '#D2B48C' : 'transparent'
                }}
              />
            </View>
            <Text>{state.description}</Text>
          </View>
        </Card.Content>

        <View style={styles.container}>
          <View style={[{ width: "60%", margin: 10 }]}>
            <Button
              title='Delete'
              color='#D11A2A'
              onPress={() => setState({ confirmDelete: true })}
            />
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={state.confirmDelete}
          onRequestClose={() => {
            setState({ confirmDelete: false });
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Delete post?</Text>

              <View style={[{ width: width / 2, margin: 5 }]}>
                <Button
                  title='Delete'
                  color='#D11A2A'
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

      </ScrollView>
    </View>
  )
}

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  flexRowView: {
    flexDirection: 'row',
  },
  boldTextStyle: {
    fontWeight: 'bold',
    marginRight: 5
  }
});