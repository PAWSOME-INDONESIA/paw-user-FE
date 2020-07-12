import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View, Button, TextInput} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from "../../utils/API";

export default function Post() {
  let [selectedImage, setSelectedImage] = React.useState(null);

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

    uploadImage(formData).then(val => {
      console.log(val, 'helo upload')
    })

    setSelectedImage({localUri: pickerResult.uri});
  };

  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setSelectedImage(null)}>
          <Text>Change</Text>
        </TouchableOpacity>
        <Image source={{ uri: selectedImage.localUri }} style={styles.thumbnail} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/*<Image source={{ uri: 'https://i.pinimg.com/originals/db/e6/b9/dbe6b90d0fd0d209001cb64eefd038d7.gif' }} style={styles.logo} />*/}
      <Text style={styles.instructions}>
        Share your paw stories
      </Text>

      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Choose a photo</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 80, alignItems: 'center' }}>
        <Text category="h4">Post Details</Text>
        <TextInput
          placeholder="Enter title of the post"
          style={{ margin: 20 }}
          value={'this.state.title'}
          onChangeText={title => console.log(title)}
        />
        <TextInput
          placeholder="Enter description"
          style={{ margin: 20 }}
          value={'this.state.description'}
          onChangeText={description => console.log(description)}
        />
        <Button onPress={() => alert('submit')} title={'Submit'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4ded3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 20,
  },
  instructions: {
    color: '#000000',
    fontSize: 16,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#d2772e',
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});
