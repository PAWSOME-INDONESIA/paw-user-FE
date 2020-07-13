import React, {useEffect, useState} from 'react';
import {
  StyleSheet, View, Text
} from 'react-native';

export default function Post(props) {

  return (
    <View style={styles.container}>
      <Text>Helo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    width: '100%'
  },
});
