import React, {useEffect, useState} from 'react';
import {
  StyleSheet, View, Text, Image,
  Dimensions,
  TouchableOpacity, Alert
} from 'react-native';
import Modal from 'react-native-modal';
import {AntDesign} from "@expo/vector-icons";
import { deleteUserPost } from "../../../utils/API";

export default function Post(props) {
  const deletePost = () => {
    Alert.alert(
      'Delete',
      'Do you want to delete this post?',
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
            deleteUserPost(props.post.id).then(res => {
              if(res === 'success'){
                props.deletePost(props.post.id)
                props.onClose()
              } else {
                alert('failed to delete post')
              }
            })
          },
        },
      ],
      { cancelable: false }
    );
  }

  return (
    <Modal
      isVisible={props.visible}
      onSwipeComplete={props.onClose}
      swipeThreshold={50}
      swipeDirection={['down']}
    >
      <View>
        <View style={{height: 40, backgroundColor: 'white'}}>
          <View style={styles.icon}>
            <View style={styles.iconBody}>
              <TouchableOpacity onPress={deletePost}>
                <AntDesign name="closecircle" size={30} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Image source={{uri: props.post.imageUrl}} style={styles.image}/>
        <View style={styles.box}>
          <Text>
            Likes
          </Text>
        </View>
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
  box: {
    height: 200,
    backgroundColor: 'white'
  },
  icon: {
    flexDirection: "row",
    justifyContent: "flex-end",
    top: -15,
    right: -10,
  },
  iconBody: {
    backgroundColor: 'white',
    borderRadius: 50,
    height: 30,
    width: 30
  }
});
