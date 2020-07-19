import React from 'react';
import {
  Modal,
  StyleSheet, View
} from 'react-native';
import Profile from "../index";

export default function Followers(props) {
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.open}
        onRequestClose={props.close()}
      >
        <Profile/>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: 'white'
  },
  centeredView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    width: '100%',
    height: '100%',
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
    shadowRadius: 3.84,
    elevation: 5,
  },
});
