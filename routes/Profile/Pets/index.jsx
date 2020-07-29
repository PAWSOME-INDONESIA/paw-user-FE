import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet, View, Text, TextInput,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import {Button, Picker, Thumbnail} from 'native-base';
import moment from 'moment';
import Modal from 'react-native-modal';
import {AntDesign, Feather, Ionicons} from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import {deleteUserPet, editUserPet, uploadImage} from "../../../utils/API";
import ProgressiveImage from '../../../components/ProgressiveImage'
import DatePicker from "react-native-datepicker";
import * as ImagePicker from "expo-image-picker";
import Loader from "../../../Screen/Components/Loader";

export default function Pets(props) {
  const refRBSheet = useRef();
  const [updatedAt, setUpdatedAt] = useState('');
  const [petName, setPetName] = useState('');
  const [breed, setBreed] = useState('');
  const [editMsg, setEditMsg] = useState('');
  const [date, setDate] = useState(moment(props.pet.birthDate).format('YYYY-MM-DD'));
  const [locationUrl, setLocationUrl] = useState('');
  const [onEdit, setOnEdit] = useState(false);
  const [imageUrl, setImageUrl] = useState(props.pet.imageUrl);
  const [uploading, setUploading] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setDate(moment(props.pet.birthDate).format('YYYY-MM-DD'))
    setImageUrl(props.pet.imageUrl)
    setPetName(props.pet.name)
    setBreed(props.pet.breed)
    setLocationUrl(props.pet.locationUrl)
    setUpdatedAt(props.pet.updated_at)
  }, [props.pet])

  useEffect(() => {
    setOnEdit(false)
  },[props.visible])

  const changePetImage = async () => {

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

    setUploading(true)
    uploadImage(formData).then(val => {
      if(val.image_url){
        setImageUrl(`${val.image_url}`)
        setUploading(false)
        alert('image uploaded!')
      }
    })

    setSelectedImage({localUri: pickerResult.uri});
  };

  const deletePet = () => {
    Alert.alert(
      'Delete',
      'Do you want to delete this pet?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
        },
        {
          text: 'Confirm',
          onPress: () => {
            //confirm delete
            deleteUserPet(props.pet.id).then(res => {
              if(res === 'success'){
                console.log(res, 'helo delete')
                props.deletePet(props.pet.id)
                props.onClose()
              } else {
                alert('failed to delete pet')
              }
            })
          },
        },
      ],
      { cancelable: false }
    );
  }

  const editPet = () => {
    refRBSheet.current.close()
    setOnEdit(true)
  }

  const saveMsg = () => {
    const param = JSON.stringify({
      "name": petName,
      "breed": breed,
      "birthDate": date,
      "imageUrl": imageUrl,
      "locationUrl": locationUrl
    })

    editUserPet(param, props.pet.id).then(res => {
      console.log(res, 'helo param')
      if(res === 'failed') {
        setPetName(props.pet.name)
        setPetName(props.pet.breed)
        setDate(props.pet.birthDate)
        alert('failed to update pet data')
        setOnEdit(false)
        return
      }
      setOnEdit(false)
      setUpdatedAt(res.updated_at)
      setEditMsg(editMsg)
      props.updatePet(res)
    })
  }

  const a = moment([date]);
  const b = moment();

  return (
    <Modal
      isVisible={props.visible}
      onSwipeComplete={props.onClose}
      swipeThreshold={50}
      swipeDirection={['down']}
    >
      <View>
        <Loader loading={uploading} />
        <KeyboardAvoidingView behavior={(Platform.OS === 'ios') ? "padding" : null} keyboardVerticalOffset={170}>
          <View style={{height: 50, backgroundColor: 'white', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
            <View style={styles.icon}>
              {!props.notEditable && (
                <TouchableOpacity style={{left: 25, width: 100, height: 70}} onPress={() => refRBSheet.current.open()}>
                  <Feather name="more-horizontal" size={28} color="black" style={{top: 13, left: 30}}/>
                </TouchableOpacity>
              )}

              {props.notEditable && (
                <TouchableOpacity style={{left: 10, width: 50, height: 70, top: 10}} onPress={() => props.onClose()}>
                  <AntDesign name="closesquare" size={30} color="black" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.icon2}>
              <Thumbnail small source={{uri: props.userProfile.imageUrl}} style={{top: -62, left: 10}}/>
              <Text style={{top: -52, left: 30, fontWeight: 'bold'}}>{props.userProfile.username}</Text>
            </View>
          </View>
          {selectedImage === null ? (
            <ProgressiveImage
              thumbnailSource={{ uri: props.pet.imageUrl }}
              source={{ uri: props.pet.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <ProgressiveImage
              thumbnailSource={{ uri: props.pet.imageUrl }}
              source={{ uri: selectedImage.localUri }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          <View style={styles.caption}>
            {!onEdit && (
              <Text style={{paddingLeft: 10, marginTop: 10, fontSize: 24, fontWeight: "700", color: 'white', width: 230, backgroundColor: 'black'}}>
                {`${petName}  `}
                <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>
                  {b.diff(a, 'years')} y/o
                </Text>
              </Text>)}

            {onEdit && (
              <View style={{flexDirection: 'row', top: 30}}>
                <Text style={{fontWeight: 'bold', paddingLeft: 20}}>
                  {`Name: `}
                </Text>
                <TextInput value={petName} style={styles.nameBox} onChangeText={txt => setPetName(txt)}/>
              </View>
            )}
            {onEdit ? (
              <View style={{flexDirection: 'row', height: 40, marginLeft: 10, top: 50}}>
                <Text style={{fontWeight: 'bold', paddingLeft: 10}}>
                  {`Date of Birth: `}
                </Text>
                <View style={styles.editProfileRow}>
                  <DatePicker
                    style={{width: 217}}
                    mode="date"
                    date={date}
                    placeholder="Select date"
                    format="YYYY-MM-DD"
                    minDate="1950-05-01"
                    maxDate="2021-05-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        right: -5,
                        top: 4,
                        marginRight: 0
                      },
                      dateInput: {
                        marginRight: 34,
                        marginLeft: 30
                      },
                      btnTextCancel: {
                        color: 'white'
                      },
                      btnTextConfirm: {
                        color: '#32CD32'
                      },
                      datePickerCon: {
                        backgroundColor: 'rgba(0,0,0,0.9)'
                      }
                    }}
                    onDateChange={(birthDate) => setDate(birthDate)}
                  />
                </View>
                <TouchableOpacity onPress={() => {
                  setOnEdit(false)
                  setPetName(props.pet.name)
                  setBreed(props.pet.breed)
                  setDate(moment(props.pet.birthDate).format('YYYY-MM-DD'))
                }} style={{width: 60, height: 40, right: 310, top: 100, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: 'red'}} >
                    cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => saveMsg()} style={{width: 60,height: 40, right: 100, top: 100, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: 'green'}} >
                    save
                  </Text>
                </TouchableOpacity>
              </View>) : (
              <Text style={{paddingLeft: 10, marginTop: 10}}>
                <Text style={{fontWeight: '600'}}>
                  {"Date of Birth : " + moment(date).format('DD MMM YYYY')}
                </Text>
                {editMsg}
              </Text>)}
            {onEdit && (
              <View style={{flexDirection: 'row', top: 70}}>
                <Text style={{fontWeight: 'bold', paddingLeft: 20}}>
                  {`Breed: `}
                </Text>
                <Picker
                  mode="dropdown"
                  iosIcon={<Ionicons name="ios-arrow-down" size={24} color="black" />}
                  style={{ width: 140, left: 90, bottom: 15 }}
                  placeholder="Select Breed"
                  placeholderStyle={{ color: "#d3d3d3" }}
                  placeholderIconColor="#007aff"
                  selectedValue={breed}
                  onValueChange={res => setBreed(res)}
                >
                  <Picker.Item label="Dogs" value="Dogs" />
                  <Picker.Item label="Cats" value="Cats" />
                </Picker>
              </View>
            )}
            {!onEdit &&
            (
              <Text style={{paddingLeft: 10, marginTop: 10}}>
                <Text style={{fontWeight: '600'}}>
                  {"Breed : " + breed}
                </Text>
              </Text>
            )}
            {!onEdit &&
            (
              <Text style={{fontSize: 11, color: '#a4a4a7', bottom: -100, left: 10, fontWeight: 'bold'}}>
                {"Last Updated at : " + moment(updatedAt).fromNow()}
              </Text>
            )}
          </View>
          {onEdit && (
            <TouchableOpacity
              style={styles.changeImageButton} onPress={() => changePetImage()}>
              <Text style={{fontWeight: 'bold', color: 'white'}}> Change Image</Text>
            </TouchableOpacity>
          )}
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: 'rgba(0,0,0,0.5)'
              },
              draggableIcon: {
                backgroundColor: "#000"
              }
            }}
          >
            <View style={{backgroundColor: 'black', height: '100%'}}>
              <Button full danger style={{height: 60}} onPress={deletePet}>
                <Text style={{fontSize: 20, color: 'white'}}>Delete</Text>
              </Button>
              <Button full dark style={{ borderBottomColor: 'grey', borderBottomWidth: 1, height: 60}} onPress={editPet}>
                <Text style={{fontSize: 18, color: 'white'}}>Edit</Text>
              </Button>
              <Button full dark style={{ borderBottomColor: 'grey', borderBottomWidth: 1, height: 60}} onPress={() => refRBSheet.current.close()}>
                <Text style={{fontSize: 18, color: 'white'}}>Cancel</Text>
              </Button>
            </View>
          </RBSheet>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: "100%",
    aspectRatio: 1
  },
  caption: {
    height: 230,
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  box: {
    height: 30,
    backgroundColor: 'white'
  },
  icon: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  icon2: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  editProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    top: -10
  },
  changeImageButton: {
    left: 120,
    width: 130,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 270,
    borderRadius: 50
  },
  nameBox: {
    borderWidth: 1,
    width: 150,
    height: 39,
    top: -10,
    left: 78,
    borderColor: 'grey',
    justifyContent: 'center',
    textAlign: 'center'
  }
});
