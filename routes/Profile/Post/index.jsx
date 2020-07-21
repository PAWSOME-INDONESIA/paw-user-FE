import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet, View, Image,
  Dimensions, Text, TextInput,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { Button, Thumbnail } from 'native-base';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import { deleteUserPost, getPostLikeCounter, editUserPost } from "../../../utils/API";
import ProgressiveImage from '../../../components/ProgressiveImage'

export default function Post(props) {
  const refRBSheet = useRef();
  const [likesCount, setLikesCount] = useState(0);
  const [listUserLikes, setListUserLikes] = useState([]);
  const [editMsg, setEditMsg] = useState('');
  const [tempEditMsg, setTempEditMsg] = useState('');
  const [onEdit, setOnEdit] = useState(false);

  useEffect(() => {
    getPostLikeCounter(`${props.post.id}`).then(res => {
      setLikesCount(res.likesCount)
    })
  },[])

  useEffect(() => {
    setEditMsg(props.post.caption)
    setTempEditMsg(props.post.caption)
  }, [props.post.caption])

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
    refRBSheet.current.close()
    setOnEdit(true)
  }

  const saveMsg = () => {
    const param = JSON.stringify({
      "caption": editMsg,
    })
    editUserPost(param, props.post.id).then(res => {
      console.log(res, 'helo')
      if(res === 'failed') {
        alert('failed to update caption')
        setOnEdit(false)
        return
      }
        setOnEdit(false)
        setEditMsg(editMsg)
    })
  }

  return (
    <Modal
      isVisible={props.visible}
      onSwipeComplete={props.onClose}
      swipeThreshold={50}
      swipeDirection={['down']}
    >
      <View>
        <KeyboardAvoidingView behavior={(Platform.OS === 'ios') ? "padding" : null} keyboardVerticalOffset={170}>
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
          {onEdit ? (
            <View style={{flexDirection: 'row', height: 40, marginLeft: 10}}>
              <View style={{marginTop: 10, width: '95%'}}>
                <TextInput value={editMsg} onChangeText={(val) => setEditMsg(val)}/>
              </View>
                <TouchableOpacity onPress={() => {
                  setOnEdit(false)
                  setEditMsg(tempEditMsg)
                }} style={{width: 60, height: 40, right: 330, top: 35, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: 'red'}} >
                    cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => saveMsg()} style={{width: 60,height: 40, top: 35, left: -120, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: 'green'}} >
                    save
                  </Text>
                </TouchableOpacity>
            </View>) : (
            <Text style={{paddingLeft: 10, marginTop: 10}}>
              <Text style={{fontWeight: '600'}}>
                {props.userProfile.username + "  "}
              </Text>
              {editMsg}
            </Text>)}
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
