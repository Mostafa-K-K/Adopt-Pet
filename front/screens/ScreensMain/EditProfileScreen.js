import React from 'react';

import {
  View,
  StyleSheet,
  Button,
  Dimensions
} from 'react-native';

export default function EditProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.styleButton}>
        <Button
          title='Information'
          color='#D2B48C'
          onPress={() => navigation.navigate('changeinformation')}
        />

        <Button
          title='Username'
          color='#D2B48C'
          onPress={() => navigation.navigate('changeusername')}
        />

        <Button
          title='Password'
          color='#D2B48C'
          onPress={() => navigation.navigate('changepassword')}
        />
      </View>
    </View>
  )
}

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  styleButton: {
    marginTop: 100,
    flex: 0.5,
    width: width / 1.5,
    flexDirection: 'column',
    justifyContent: 'space-around'
  }
});