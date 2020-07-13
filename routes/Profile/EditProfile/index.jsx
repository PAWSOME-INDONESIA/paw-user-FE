import React, {useState} from 'react';
import { StyleSheet, Text, TextInput, View, Modal, Image, AsyncStorage, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import moment from "moment";

import DatePicker from "react-native-datepicker";

import {editUser, uploadImage} from "../../../utils/API";
import isEmpty from "react-native-web/dist/vendor/react-native/isEmpty";

export default function EditProfile(props) {
  const [date, setDate] = React.useState(moment(props.userProfile.birthDate).format('YYYY-MM-DD'));
  const [userName, setUserName] = React.useState(props.userProfile.username);
  const [phoneNumber, setPhoneNumber] = React.useState(props.userProfile.phoneNumber);
  const [bio, setBio] = React.useState(props.userProfile.bio);
  const [imageUrl, setImageUrl] = React.useState(props.userProfile.imageUrl);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [saving, setSaving] = React.useState(false);

  const onChangeDate = props => {
    setDate(props)
  }

  const editProfile = value => {
    setSaving(true)
      const param = JSON.stringify({
        "username": userName,
        "phoneNumber": phoneNumber,
        "bio": bio,
        "birthDate": date,
        "imageUrl": imageUrl
      })

      AsyncStorage.getItem('@session').then(res => {
        editUser(res, param).then(val => {
          console.log(val, 'helo world')
          setSaving(false)
          props.editProfile(val)
        })
      })
  }

  const closeImage = () => {
    setSelectedImage(null)
  }

  const changeProfilePic = async () => {

    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    let localUri = pickerResult.uri;
    let filename = localUri.split('/').pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append('image', { uri: localUri, name: filename, type });

    uploadImage(formData).then(val => {
      if(val){
        setImageUrl(`${val}`)
        alert('success upload')
      }
    })

    setSelectedImage({localUri: pickerResult.uri});
  };
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {

    console.log(selectedDate, 'helo rekt')

    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const imgUrl = isEmpty(imageUrl) ? require('../../../assets/dog.png') : { uri: imageUrl}

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.open}
        onRequestClose={() => {
          alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.navProfileRow}>
              <View style={styles.leftContainer}>
                <TouchableOpacity
                  style={{ ...styles.cancelButton, backgroundColor: "red" }}
                  onPress={() => {
                    props.close();
                  }}
                >
                  <Text style={styles.textStyleHeader}>Cancel</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.rightContainer}>
                {saving ?
                  <ActivityIndicator size="small" color="#00ff00" style={{ ...styles.saveButton, backgroundColor: "green" }} /> :
                  <TouchableOpacity
                    title="save"
                    style={{ ...styles.saveButton, backgroundColor: "green" }}
                    onPress={() => editProfile()}
                  >
                    <Text style={styles.textStyleHeader}>Done</Text>
                  </TouchableOpacity>
                }
              </View>

            </View>
            <Text style={styles.modalText}>Edit Profile</Text>
            {selectedImage !== null ? (
              <View style={styles.imageProfile}>
                <Image source={{ uri: selectedImage.localUri }} style={styles.imageProfile} />
              </View>
            ) : (<Image style={styles.imageProfile} source={imgUrl}/>)
            }
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={selectedImage === null ? changeProfilePic : closeImage}
            >
              <Text style={styles.textStyle}>{selectedImage === null ? 'Change Profile Photo' : 'Remove'}</Text>
            </TouchableOpacity>
            <View style={styles.editProfileForm}>

              <View style={styles.editProfileRow}>
                <Text style={styles.formText}>
                  Username
                </Text>
                <TextInput
                  style={styles.form}
                  placeholder="e.g., Brown"
                  defaultValue={userName}
                  onChangeText={text => setUserName(text)}
                />
              </View>

              <View style={styles.editProfileRow}>
                <Text style={styles.formText}>
                  Phone Number
                </Text>
                <TextInput
                  style={styles.form}
                  placeholder="e.g., +62 823..."
                  defaultValue={phoneNumber}
                  onChangeText={text => setPhoneNumber(text)}
                />
              </View>

              <View style={styles.editProfileRow}>
                <Text style={styles.formText}>
                  Bio
                </Text>
                <TextInput
                  style={styles.form}
                  placeholder="Tell them about your self"
                  defaultValue={bio}
                  onChangeText={text => setBio(text)}
                />
              </View>

              <View style={styles.editProfileRow}>
                <Text style={styles.formText}>
                  Date Of Birth
                </Text>

                <DatePicker
                  style={{width: 200}}
                  mode="date"
                  date={date}
                  placeholder="Select date"
                  format="YYYY-MM-DD"
                  minDate="2012-05-01"
                  maxDate="2050-05-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      right: 0,
                      top: 4,
                      marginRight: 0
                    },
                    dateInput: {
                      marginRight: 34,
                      marginLeft: 30
                    },
                    btnTextCancel: {
                      color: 'orange'
                    },
                    btnTextConfirm: {
                      color: '#32CD32'
                    },
                    datePickerCon: {
                      backgroundColor: '#666666'
                    }
                  }}
                  onDateChange={(birthDate) => onChangeDate(birthDate)}
                />
              </View>
            </View>
            <View style={styles.datePicker}>
              {/*<View>*/}
              {/*  <Button onPress={showDatepicker} title="Show date picker!" />*/}
              {/*</View>*/}

              {/*{show && (*/}
              {/*  <DateTimePicker*/}
              {/*    testID="dateTimePicker"*/}
              {/*    value={date}*/}
              {/*    mode={mode}*/}
              {/*    is24Hour={true}*/}
              {/*    display="default"*/}
              {/*    onChange={onChange}*/}
              {/*    */}
              {/*  />*/}
              {/*)}*/}
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
  navProfileRow: {
    flexDirection: 'row',
    width: '100%',
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
    marginBottom: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
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
  saveButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
  },
  cancelButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    width: 150
  },
  textStyleHeader: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 20
  },
  thumbnail: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  datePicker: {
    width: '100%',
    height: 50,
    position: 'absolute',
    bottom: 250
  }
});
