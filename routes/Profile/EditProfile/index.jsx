import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableHighlight,
  Image
} from 'react-native';

import DatePicker from 'react-native-datepicker'

import Moment from 'moment';

export default function EditProfile(props) {
  const [userProfile, setUserProfile] = React.useState(props.userProfile);

  console.log(props, 'helo props 2')
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
            <Text style={styles.modalText}>Edit Profile</Text>
            <Image style={styles.imageProfile} source={require('../../../assets/dog.png')}/>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                props.close();
              }}
            >
              <Text style={styles.textStyle}>Change Profile Photo</Text>
            </TouchableHighlight>
            <View style={styles.editProfileForm}>

              <View style={styles.editProfileRow}>
                <Text style={styles.formText}>
                  Username
                </Text>
                <TextInput
                  style={styles.form}
                  placeholder="Type here to translate!"
                  defaultValue={userProfile.userName}
                />
              </View>

              <View style={styles.editProfileRow}>
                <Text style={styles.formText}>
                  Phone Number
                </Text>
                <TextInput
                  style={styles.form}
                  placeholder="Type here to translate!"
                  defaultValue={userProfile.phoneNumber}
                />
              </View>

              <View style={styles.editProfileRow}>
                <Text style={styles.formText}>
                  Bio
                </Text>
                <TextInput
                  style={styles.form}
                  placeholder="Type here to translate!"
                  defaultValue={userProfile.bio}
                />
              </View>

              <View style={styles.editProfileRow}>
                <Text style={styles.formText}>
                  Date Of Birth
                </Text>
                <TextInput
                  style={styles.form}
                  placeholder="Type here to translate!"
                  defaultValue={Moment(userProfile.birthDate).format('DD MMM YYYY')}
                />
              </View>

              <DatePicker
                style={{width: 200}}
                date={userProfile.birthDate}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="2016-05-01"
                maxDate="2016-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                  // ... You can check the source to find the other keys.
                }}
                // onDateChange={(date) => {this.setState({date: date})}}
              />

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
  editProfileForm: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  editProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  formText: {
    paddingLeft: 5,
    width: 100,
    fontWeight: '700',
  },
  form: {
    height: 40,
    marginLeft: 30,
    width: 200,
  },
  imageProfile: {
    width: 100,
    height: 100
  },
  editProfile: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 20,
    backgroundColor: 'black',
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', // Centered horizontally
    height: 35
  },
  editProfileText: {
    color: 'white',
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 20
  }
});
