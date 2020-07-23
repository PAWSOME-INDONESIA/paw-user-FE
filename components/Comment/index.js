import React, {useEffect, useState, useRef, useReducer} from 'react';
import {
  StyleSheet, View, TextInput, Keyboard, Platform, Image,
  KeyboardAvoidingView, Text, FlatList, ActivityIndicator, Button, TouchableWithoutFeedback, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {Body, Left, ListItem, Right, Thumbnail} from "native-base";
import {deleteComment, getCommentCount, postComment} from "../../utils/API";
import isEmpty from "lodash/isEmpty";
import Swipeout from 'react-native-swipeout';
import { Video } from 'expo-av';

export default function Comment(props) {
  const [comment, setComment] = useState([])
  const [commentId, setCommentId] = useState('')
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lastPage, setLastPage] = useState(false);
  const [lastId, setLastId] = useState('')
  const [text, setText] = useState('')
  const [disable, setDisabled] = useState(true)

  console.log(props, 'helo comment props')

  useEffect(() => {
    loadComment()
    getCommentCount(props.feedDetail.post.id).then(res => {
      setTotal(Math.floor(res/5))
    })
  }, [])

  async function loadComment(pageNum = page, shouldRefresh = false, firstFetch = false){
    if(total && page > total) return;

    if(lastPage && !shouldRefresh){
      return null
    }

    const response = await fetch(`https://paw-user-yej2q77qka-an.a.run.app/comment/by-post?postID=${props.feedDetail.post.id}&lastID=${lastId}&limit=5`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })})

    const data = await response.json()
    const result = data.data.comments
    // let totalItems

    if(isEmpty(result)){
      setLoading(false)
      setLastPage(true)
      setLastId('')
      return null
    }

    if(firstFetch){
      setLoading(false)
      setLastPage(false)
      setLastId(result[result.length - 1].comment.id)
      setComment(result)
      setPage(1)
      return null
    } else {
      setLastId(result[result.length - 1].comment.id)
      setComment(shouldRefresh ? data : [...comment, ...result])
      setPage(pageNum + 1)
      setLoading(false)
      setLastPage(false)
    }
  };

  const renderRow = ({item}) => {
    const sw={
      autoClose:true,
      right:[{
        text:'Delete',
        backgroundColor: 'red',
        onPress:()=>{
          deleteComment(item.comment.id).then(res=> {
            let id = item.comment.id
            if(res === 'success'){
              const filteredItems = comment.filter(item => item.comment.id !== id)
              console.log(filteredItems, 'succeess')
              setComment(filteredItems)
            } else {
              alert('failed to delete comment')
            }
          })
          console.log('delete comment')
        }
      }]
    }
    return(
      <Swipeout {...sw} style={{backgroundColor: 'white'}} disabled={item.user.id !== props.userId}>
        <ListItem thumbnail>
          <Left>
            <Thumbnail circular source={{ uri: item.user.imageUrl }} />
          </Left>
          <Body>
            <Text>{item.comment.text}</Text>
            <Text note numberOfLines={1}  style={{color: 'grey', fontSize: 10, marginTop: 5}}>-{item.user.username}</Text>
          </Body>
          <Right>
            {/*<Button transparent>*/}
            {/*  <Text style={{color: 'blue'}}>View</Text>*/}
            {/*</Button>*/}
          </Right>
        </ListItem>
      </Swipeout>
    )
  }

  const footer = () => {
    return(
      loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View> ) : null
    )
  }

  const enterComment = () => {
    const param = JSON.stringify({
      "postID": props.feedDetail.post.id,
      "userID": props.userId,
      "text": text
    })

    postComment(param).then(res => {
      console.log(comment, 'commented')

      if(res !== 'failed'){
        setComment([...comment, res])
      }
    })
  }

  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}> {children}
    </TouchableWithoutFeedback>
  );

  console.log(props.feedDetail, 'helo feed')

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{left: 10, top: 10}} onPress={props.closeComment}>
        <Ionicons name="ios-arrow-back" size={30} color="blue" />
      </TouchableOpacity>
      {props.feedDetail.post.type === 'image' && (
        <Image source={{uri: props.feedDetail.post.imageUrl}} style={{height: 300, marginTop: 10, resizeMode: 'contain'}}/>
      )}
      {props.feedDetail.post.type === 'video' && (
        <Video
          source={{ uri: props.feedDetail.post.imageUrl }}
          rate={1.0}
          volume={0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay={true}
          isLooping
          style={{height: 300, marginTop: 10}}
        />
      )}
      {/*<View style={styles.head}/>*/}
        <KeyboardAvoidingView behavior={(Platform.OS === 'ios') ? "padding" : null} style={styles.form} keyboardVerticalOffset={100}>
          <FlatList
            data={comment}
            refreshing={refreshing}
            onEndReached={() => loadComment()}
            onEndReachedThreshold={0.1}
            keyExtractor={data => String(data.comment.id)}
            renderItem={item => renderRow(item)}
            ListFooterComponent={footer}
          />
          <View style={styles.flex}>
              <TextInput placeholder="add a comment here..." style={styles.textInput} onChangeText={txt => setText(txt)} value={text}/>
            <Button title="Comment" onPress={() => {
              enterComment()
              setText('')
              Keyboard.dismiss()
            }} disabled={text === ''}/>
          </View>
        </KeyboardAvoidingView>
    </View>
  );
}

const offset = 24;
const styles = StyleSheet.create({
  container : {
    backgroundColor: 'white',
    height: '100%'
  },
  head: {
    flex: 1,
  },
  foot: {
    padding: 40,
    backgroundColor: 'red'
  },
  textInput: {
    height: 50,
    width: '70%',
    paddingVertical: 0,
    paddingHorizontal: 20
  },
  flex: {
    flexDirection: 'row',
    borderTopWidth: 0.3,
    borderTopColor: 'lightgrey'
  },
  title: {
    fontSize: 14,
    marginBottom: 5
  },
  loader: {
    marginTop: 10,
    alignItems: 'center'
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nameInput: {
    height: offset * 2,
    margin: offset,
    paddingHorizontal: offset,
    borderColor: '#111111',
    borderWidth: 1,
  },
});
