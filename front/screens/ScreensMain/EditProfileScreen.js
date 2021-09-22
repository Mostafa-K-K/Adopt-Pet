import React from 'react';

import {
  View,
  StyleSheet,
  Button
} from 'react-native';

export default function EditProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title='Information'
        onPress={() => navigation.navigate('changeinformation')}
      />

      <Button
        title='Username'
        onPress={() => navigation.navigate('changeusername')}
      />

      <Button
        title='Password'
        onPress={() => navigation.navigate('changepassword')}
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