import React, {useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text, ScrollView,
  TouchableOpacity,
  View, ActivityIndicator, TextInput, KeyboardAvoidingView, ImageBackground
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { Button, DatePicker } from 'native-base';
import {uploadImage, postUserPost, postPet} from "../../utils/API";
import AsyncStorage from "@react-native-community/async-storage";
import { MaterialIcons } from '@expo/vector-icons';
import isEmpty from "lodash/isEmpty";
import moment from "moment";

export default function Post(props) {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [selectedImage2, setSelectedImage2] = React.useState(null);
  const [caption, setCaption] = React.useState('');
  const [fd, setFd] = React.useState('');
  const [bday, setBday] = React.useState('');
  const [fileType, setFileType] = React.useState('');
  const [shouldPlay, setShouldPlay] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(false);
  const [errorMsg2, setErrorMsg2] = React.useState(false);
  const [funcAddPet, setFuncAddPet] = React.useState(false);
  const [funcAddPost, setFuncAddPost] = React.useState(false);

  useEffect(() => {
    if(!isEmpty(caption)){
      setErrorMsg(false)
    } else {
      setErrorMsg(true)
    }
  }, [caption])

  useEffect(() => {
    if(!isEmpty(bday.toString())){
      setErrorMsg2(false)
    } else {
      setErrorMsg2(true)
    }
  }, [bday])

  const openImagePickerAsync = async (tipe) => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const mediaType = tipe === 'isPost' ? ImagePicker.MediaTypeOptions.All : ImagePicker.MediaTypeOptions.Images

      let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
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

    setFd(formData)

    if(tipe === 'isPost'){
      setSelectedImage({localUri: pickerResult.uri});
      setFileType(match[0])
    }
    if(tipe === 'isPet'){
      setSelectedImage2({localUri: pickerResult.uri})
      setFileType(match[0])
    }
  };

  const launchCamera = async (tipe) => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync();
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

    setFd(formData)

    console.log(tipe, 'tipe')

    if(tipe === 'isPost'){
      setSelectedImage({localUri: pickerResult.uri});
      setFileType(match[0])
    }

    if(tipe === 'isPet'){
      setSelectedImage2({localUri: pickerResult.uri})
      setFileType(match[0])
    }
  };

  const back = () => {
    setFuncAddPet(false)
    setFuncAddPost(false)
  }

  const PostImage = () => {
    if(!isEmpty(caption)){
      setErrorMsg(false)
      setShouldPlay(false)
      AsyncStorage.getItem('@session').then(userId =>
        {
          setUploading(true)
          uploadImage(fd).then(val => {
            const param = JSON.stringify({
              "imageUrl": val.image_url,
              "userID": userId,
              "caption": caption,
              "type": val.type
            })
            postUserPost(param).then(res => {
              if(res !== 'failed'){
                setUploading(false)
                setSelectedImage(null)
                setFileType('')
                props.navigation.navigate('Profile', {loadPage: true, userPost: res})
              } else {
                setSelectedImage(null)
                setUploading(false)
                setFileType('')
              }
            })
          })
        }
      );
    } else {
      setErrorMsg(true)
    }
  }

  const addPet = () => {
    if(!isEmpty(caption) && !isEmpty(bday.toString())){
      setErrorMsg(false)
      setErrorMsg2(false)
      AsyncStorage.getItem('@session').then(userId =>
        {
          setUploading(true)
          uploadImage(fd).then(val => {
            const param = JSON.stringify({
              "imageUrl": val.image_url,
              "userID": userId,
              "name": caption,
              "birthDate": moment(bday).format('YYYY-MM-DD')
            })
            postPet(param).then(res => {
              if(res){
                setUploading(false)
                setSelectedImage2(null)
                props.navigation.navigate('Profile', {loadPage: true, userPet: res})
              } else {
                setUploading(false)
              }
            })
          })
        }
      );
    } else {
      setErrorMsg(true)
    }
  }

  if(uploading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          color="#009688"
          size="large"
          style={styles.ActivityIndicatorStyle}
        />
        <Text style={{top: -50}}>
          Uploading
        </Text>
      </View>
    )
  }

  if (selectedImage !== null) {
    return (
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior='position'>
        <ScrollView>
          <View style={styles.container}>
            {fileType === '.mov' || fileType === '.mp4' ? (
              <Video
                source={{ uri: selectedImage.localUri }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay={shouldPlay}
                isLooping
                style={{width: '100%', height: 500}}
              />
            ) : (
              <Image source={{ uri: selectedImage.localUri }} style={styles.thumbnail} />
            )}
            <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.button2}>
              <Text style={styles.buttonText2}>Remove Image</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.captionText}
              onChangeText={caps => setCaption(caps)}
              underlineColorAndroid="grey"
              placeholder="Write a caption..."
              placeholderTextColor="grey"
              maxLength={100}
              multiline={true}
              blurOnSubmit={false}
            />
            {
              errorMsg && (
                <Text style={{color: 'red', marginTop: 10, fontSize: 12}}>
                  Please fill in the caption!
                </Text>
              )
            }
            <TouchableOpacity
              disabled={errorMsg}
              onPress={() => {
                PostImage()
              }}
              style={errorMsg ? styles.disabled : styles.button3}
            >
              <Text style={styles.buttonText3}>Post!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (selectedImage2 !== null) {
    return (
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior='position'>
        <ScrollView>
          <View style={styles.container}>
            <Image source={{ uri: selectedImage2.localUri }} style={styles.thumbnail2} />
            <TouchableOpacity onPress={() => setSelectedImage2(null)} style={styles.button5}>
              <Text style={styles.buttonText2}>Remove Image</Text>
            </TouchableOpacity>
            <View style={styles.nameContainer}>
              <Text style={{top: 10, marginRight: 20, width: 60}}>
                Name :
              </Text>
              <TextInput
                style={styles.captionText2}
                onChangeText={caps => setCaption(caps)}
                underlineColorAndroid="grey"
                placeholder="Your Pet Name..."
                placeholderTextColor="grey"
                blurOnSubmit={false}
              />
            </View>
            {
              errorMsg && (
                <Text style={{color: 'red', marginTop: 10, fontSize: 12, marginBottom: 10}}>
                  Please fill in name
                </Text>
              )
            }
            <View style={styles.nameContainer}>
              <Text style={{top: 10, marginRight: 0, width: 80}}>
                Birth Date :
              </Text>
              <View style={{    paddingLeft: 10,
                justifyContent: 'center',
                width: '50%'}}>
                <DatePicker
                  defaultDate={new Date(2018, 4, 4)}
                  minimumDate={new Date(1950, 1, 1)}
                  maximumDate={new Date()}
                  locale={"en"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  placeHolderText="Select Date"
                  textStyle={{ color: "black" }}
                  placeHolderTextStyle={{ color: "#d3d3d3" }}
                  onDateChange={bd => setBday(bd)}
                  disabled={false}
                />
              </View>
            </View>
            {
              errorMsg2 && (
                <Text style={{color: 'red', marginTop: 10, fontSize: 12, marginBottom: 10}}>
                  Please select date
                </Text>
              )
            }
            <TouchableOpacity
              disabled={errorMsg2}
              onPress={() => {
                addPet()
              }}
              style={errorMsg2 ? styles.disabled : styles.button3}
            >
              <Text style={styles.buttonText3}>Add Pet!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  const showContent = (type) => {
    return(
      <ImageBackground source={{uri: 'https://i.pinimg.com/originals/02/ed/60/02ed60be51ca5db46a35c770baf5e067.png'}}
                         style={styles.container}>
        <TouchableOpacity onPress={() => openImagePickerAsync(type)} style={styles.button}>
          <Text style={styles.buttonText}>Choose a photo</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => launchCamera(type)} style={styles.button}>
          <Text style={styles.buttonText}>Launch Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={back} style={styles.button4}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </ImageBackground>
    )
  }

  if(funcAddPet){
    return(
      showContent('isPet')
    )
  }

  if(funcAddPost){
    return(
      showContent('isPost')
    )
  }

  return (
    <ImageBackground source={{uri: 'https://i.pinimg.com/originals/02/ed/60/02ed60be51ca5db46a35c770baf5e067.png'}}
           style={{width: '100%', height: '100%'}}>
      <View style={styles.chooseContainer}>
        <Button style={styles.choose} onPress={() => setFuncAddPost(true)}>
          <MaterialIcons name="add-a-photo" size={55} color="white" style={{top: 30, left: 55}}/>
          <Text style={{left: -35, top: -30, fontSize: 30, color: 'white'}}>Add Post</Text>
        </Button>
        <Button style={styles.choose} onPress={() => setFuncAddPet(true)}>
          <MaterialIcons name="pets" size={55} color="white" style={{top: 30, left: 55}}/>
          <Text style={{left: -35, top: -30, fontSize: 30, color: 'white'}}>Add Pet</Text>
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 20,
    marginTop: 20,
    width: '90%',
    borderRadius: 5,
  },
  button2: {
    backgroundColor: '#e75522',
    padding: 10,
    marginTop: 20,
    width: '100%',
    top: -25
  },
  button3: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 20,
    width: '100%',
    bottom: 0
  },
  button4: {
    backgroundColor: 'red',
    padding: 20,
    marginTop: 20,
    width: '30%',
    borderRadius: 5,
  },
  button5: {
    backgroundColor: '#231010',
    padding: 10,
    marginTop: 30,
    width: '50%',
    top: -25,
    borderRadius: 20
  },
  buttonText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center'
  },
  buttonText2: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  buttonText3: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
    // borderColor: 'black',
    // borderWidth: 1,
  },
  thumbnail2: {
    width: '80%',
    height: 320,
    borderRadius: 500,
    resizeMode: 'cover',
    marginTop: 10,
    marginBottom: 10
  },
  captionText: {
    paddingLeft: 10,
    paddingTop: 10,
    color: 'black',
    width: '90%',
    height: 90,
    backgroundColor: '#e3eff5',
  },
  captionText2: {
    paddingLeft: 10,
    justifyContent: 'center',
    color: 'black',
    width: '50%',
    height: 40,
    backgroundColor: '#e3eff5',
  },
  disabled: {
    backgroundColor: 'grey',
    padding: 10,
    marginTop: 20,
    width: '100%',
    bottom: 0,
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  choose: {
    width: 170,
    height: 170,
    margin: 10,
  },
  chooseContainer: {
    top: '50%',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  nameContainer: {
    justifyContent: 'center',
    flexDirection: 'row'
  }
});
