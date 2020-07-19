import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet, View, Image,
  Dimensions, Text,
  TouchableOpacity, Alert
} from 'react-native';
import { Button, Thumbnail } from 'native-base';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import { deleteUserPost, getPostLikeCounter } from "../../../utils/API";
import ProgressiveImage from '../../../components/ProgressiveImage'

const w = Dimensions.get('window');

export default function Post(props) {
  const refRBSheet = useRef();
  const [likesCount, setLikesCount] = useState(0);
  const [listUserLikes, setListUserLikes] = useState([]);

  useEffect(() => {
    getPostLikeCounter(`${props.post.id}`).then(res => {
      setLikesCount(res.likesCount)
    })
  },[])
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

  const editPost = () => {
    console.log('editpost')
  }

  return (
    <Modal
      isVisible={props.visible}
      onSwipeComplete={props.onClose}
      swipeThreshold={50}
      swipeDirection={['down']}
    >
      <View>
        <View style={{height: 50, backgroundColor: 'white', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
          <View style={styles.icon}>
              <TouchableOpacity style={{left: 25, width: 100, height: 70}} onPress={() => refRBSheet.current.open()}>
                <Feather name="more-horizontal" size={28} color="black" style={{top: 13, left: 30}}/>
              </TouchableOpacity>
          </View>
          <View style={styles.icon2}>
            <Thumbnail small source={{uri: props.userProfile.imageUrl}} style={{top: -62, left: 10}}/>
            <Text style={{top: -52, left: 30, fontWeight: 'bold'}}>{props.userProfile.username}</Text>
          </View>
        </View>
        <ProgressiveImage
          thumbnailSource={{ uri: props.post.imageUrl }}
          source={{ uri: props.post.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {/*<View style={styles.box}>*/}
        {/*  <Text>*/}
        {/*    Icon ikes*/}
        {/*  </Text>*/}
        {/*</View>*/}
        <View style={styles.caption}>
          <Text style={{paddingLeft: 10, marginTop: 10, fontWeight: "700", color: 'red'}}>
            {`${likesCount || 0} likes`}
          </Text>
          <Text style={{paddingLeft: 10, marginTop: 10}}>
            <Text style={{fontWeight: '600'}}>
              {props.userProfile.username + "  "}
            </Text>
            {props.post.caption}
          </Text>
        </View>
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
              <Button full danger style={{height: 60}} onPress={deletePost}>
                <Text style={{fontSize: 20, color: 'white'}}>Delete</Text>
              </Button>
              <Button full dark style={{ borderBottomColor: 'grey', borderBottomWidth: 1, height: 60}} onPress={editPost}>
                <Text style={{fontSize: 18, color: 'white'}}>Edit</Text>
              </Button>
              <Button full dark style={{ borderBottomColor: 'grey', borderBottomWidth: 1, height: 60}}>
                <Text style={{fontSize: 18, color: 'white'}}>Share to...</Text>
              </Button>
            </View>
          </RBSheet>
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
    height: 180,
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
});
