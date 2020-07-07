import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text, Button
} from 'react-native';
import TouchableOpacity from "react-native-web/src/exports/TouchableOpacity";

export default function Pets(props) {

  return (
    <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={props.open}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>helo</Text>
              <View>
                <Button title={'Close'} onPress={props.close()} />
              </View>
            </View>
          </View>
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
