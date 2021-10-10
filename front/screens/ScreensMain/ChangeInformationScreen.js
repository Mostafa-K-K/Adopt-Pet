import React, { useState, useContext, useEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  Button
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import moment from 'moment';
import API from '../../API';
import SessionContext from '../../components/SessionContext';

export default function ChangeInformationScreen({ navigation }) {

  const { session: { user: { _id } } } = useContext(SessionContext);

  const [state, updateState] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    birthDate: new Date(),
    gender: '',

    show: false,

    phoneExist: false,

    isValidFirstName: false,
    isValidLastName: false,
    isValidPhone: false,
    isValidAddress: false,
  });

  function setState(nextState) {
    updateState(prevState => ({
      ...prevState,
      ...nextState
    }))
  }

  function handleDate(e, nextDate) {
    const prevDate = state.birthDate;
    const date = nextDate || prevDate;
    setState({ birthDate: date, show: false });
  };

  function handleUpdate() {
    let reqBody = {
      firstName: state.firstName.trim(),
      lastName: state.lastName.trim(),
      gender: state.gender,
      phone: state.phone.trim(),
      address: state.address.trim(),
      birthDate: state.birthDate
    }

    if (reqBody.firstName == '') setState({ isValidFirstName: true });
    if (reqBody.lastName == '') setState({ isValidLastName: true });
    if (reqBody.phone == '') setState({ isValidPhone: true });
    if (reqBody.address == '') setState({ isValidAddress: true });

    if (reqBody.firstName != ''
      && reqBody.lastName != ''
      && reqBody.phone != ''
      && reqBody.address != ''
    ) {
      API.post(`isvalidphone`, reqBody)
        .then(res => {
          const success = res.data.success;
          if (success) {
            const result = res.data.result;
            if (!result || (result && result._id == _id)) {
              API.put(`users/${_id}`, reqBody)
                .then(res => {
                  const success = res.data.success;
                  if (success) navigation.navigate('Profile');
                });
            } else { setState({ phoneExist: true }) }
          }
        });
    }
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
            birthDate: new Date(result.birthDate),
            username: result.username,
            gender: result.gender
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

        <View>
          <Text style={styles.text_footer}>First Name</Text>
          <View style={styles.action}>
            <FontAwesome
              name='hashtag'
              color='#D2B48C'
              size={20}
            />

            <TextInput
              placeholder='First Name'
              style={styles.textInput}
              autoCapitalize='none'
              value={state.firstName}
              onChangeText={(val) => setState({ firstName: val, isValidFirstName: false })}
            />
          </View>
          {state.isValidFirstName ?
            <Animatable.View animation='fadeInLeft' duration={500}>
              <Text style={styles.errorMsg}>Please fill this field</Text>
            </Animatable.View>
            : null
          }
        </View>

        <View>
          <Text style={styles.text_footer}>Last Name</Text>
          <View style={styles.action}>
            <FontAwesome
              name='pencil'
              color='#D2B48C'
              size={20}
            />
            <TextInput
              placeholder='Last Name'
              style={styles.textInput}
              autoCapitalize='none'
              value={state.lastName}
              onChangeText={(val) => setState({ lastName: val, isValidLastName: false })}
            />
          </View>
          {state.isValidLastName ?
            <Animatable.View animation='fadeInLeft' duration={500}>
              <Text style={styles.errorMsg}>Please fill this field</Text>
            </Animatable.View>
            : null
          }
        </View>

        <View>
          <Text style={styles.text_footer}>Gender</Text>
          <View style={styles.action}>
            <FontAwesome
              name='venus-mars'
              color='#D2B48C'
              size={24}
            />
            <RadioButton.Group
              value={state.gender}
              onValueChange={val => setState({ gender: val })}
            >
              <View style={{ flexDirection: 'row', marginTop: -15 }}>
                <RadioButton.Item
                  label='Male'
                  value='Male'
                  position='leading'
                  color='#D2B48C'
                  uncheckedColor='#D2B48C'
                />
                <RadioButton.Item
                  label='Female'
                  value='Female'
                  position='leading'
                  color='#D2B48C'
                  uncheckedColor='#D2B48C'
                />
              </View>
            </RadioButton.Group>
          </View>
        </View>

        <View>
          <Text style={styles.text_footer}>Phone Number</Text>
          <View style={styles.action}>
            <FontAwesome
              name='phone'
              color='#D2B48C'
              size={20}
            />
            <TextInput
              placeholder='Phone Number'
              style={styles.textInput}
              autoCapitalize='none'
              value={state.phone}
              onChangeText={(val) => setState({ phone: val, isValidPhone: false, phoneExist: false })}
              keyboardType='numeric'
            />
          </View>
          {state.isValidPhone ?
            <Animatable.View animation='fadeInLeft' duration={500}>
              <Text style={styles.errorMsg}>Please fill this field</Text>
            </Animatable.View>
            :
            state.phoneExist ?
              <Animatable.View animation='fadeInLeft' duration={500}>
                <Text style={styles.errorMsg}>Phone number already exist.</Text>
              </Animatable.View>
              : null
          }
        </View>

        <View>
          <Text style={styles.text_footer}>Address</Text>
          <View style={styles.action}>
            <FontAwesome
              name='map-o'
              color='#D2B48C'
              size={20}
            />
            <TextInput
              placeholder='Address'
              style={styles.textInput}
              autoCapitalize='none'
              value={state.address}
              onChangeText={(val) => setState({ address: val, isValidAddress: false })}
            />
          </View>
          {state.isValidAddress ?
            <Animatable.View animation='fadeInLeft' duration={500}>
              <Text style={styles.errorMsg}>Please fill this field</Text>
            </Animatable.View>
            : null
          }
        </View>

        <View>
          <Text style={styles.text_footer}>Birth Date</Text>
          <View>
            <TouchableOpacity
              style={styles.action}
              onPress={() => setState({ show: true })}
            >
              <FontAwesome
                name='calendar'
                color='#D2B48C'
                size={20}
              />
              <TextInput
                editable={false}
                style={styles.textInput}
              >
                {moment(state.birthDate).format('D   MMMM   YYYY')}
              </TextInput>
            </TouchableOpacity>
            {state.show && (
              <DateTimePicker
                value={state.birthDate}
                maximumDate={new Date()}
                mode="date"
                onChange={handleDate}
              />
            )}
          </View>
        </View>

        <View style={styles.styleButton}>
          <Button
            title='Update'
            color='#D2B48C'
            onPress={handleUpdate}
          />
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30
  },
  text_footer: {
    color: '#000000',
    fontSize: 18
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -5,
    paddingLeft: 10,
    color: '#000000'
  },
  button: {
    alignItems: 'center',
    marginTop: 50
  },
  errorMsg: {
    color: '#D11A2A',
    fontSize: 14,
  },
  styleButton: {
    padding: 30
  }
});