import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlarmScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Alarm Screen</Text>
    </View>
  );
};

export default AlarmScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});