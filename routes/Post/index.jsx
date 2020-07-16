import React, {useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text, ScrollView,
  TouchableOpacity,
  View, ActivityIndicator, TextInput, KeyboardAvoidingView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage, postUserPost } from "../../utils/API";
import AsyncStorage from "@react-native-community/async-storage";
import isEmpty from "lodash/isEmpty";

export default function Post(props) {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [caption, setCaption] = React.useState('');
  const [fd, setFd] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(false);

  useEffect(() => {
    if(!isEmpty(caption)){
      setErrorMsg(false)
    } else {
      setErrorMsg(true)
    }
  }, [caption])
  const openImagePickerAsync = async () => {
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

    setFd(formData)

    setSelectedImage({localUri: pickerResult.uri});
  };

  const launchCamera = async () => {
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

    setSelectedImage({localUri: pickerResult.uri});
  };

  const PostImage = () => {
    if(!isEmpty(caption)){
      setErrorMsg(false)
      AsyncStorage.getItem('@session').then(userId =>
        {
          setUploading(true)
          uploadImage(fd).then(val => {
            const param = JSON.stringify({
              "imageUrl": val,
              "userID": userId,
              "caption": caption
            })
            console.log(param,'helo upload param')
            postUserPost(param).then(res => {
              console.log(res, 'helo upload post')
              setUploading(false)
              setSelectedImage(null)
              props.navigation.navigate('Profile', {loadPage: true, userPost: res})
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
            <Image source={{ uri: selectedImage.localUri }} style={styles.thumbnail} />
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Choose a photo</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={launchCamera} style={styles.button}>
        <Text style={styles.buttonText}>Launch Camera</Text>
      </TouchableOpacity>
    </View>
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
  captionText: {
    paddingLeft: 10,
    paddingTop: 10,
    color: 'black',
    width: '90%',
    height: 90,
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
});
