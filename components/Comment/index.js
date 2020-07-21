import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet, View, TextInput, Keyboard, Platform,
  KeyboardAvoidingView, Text, FlatList, ActivityIndicator, Button, TouchableWithoutFeedback
} from 'react-native';

export default function Comment(props) {
  const [comment, setComment] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lastId, setLastId] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    loadComment()
  }, [])

  async function loadComment(){
    const response = await fetch(`https://paw-user-yej2q77qka-an.a.run.app/comment/by-post?postID=${props.postId}&lastID=${lastId}&limit=5`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })})

    const data = await response.json()
    const result = data.data.comments
    setComment(result)

    console.log(result,'helo world')
  };

  const renderRow = item => {
    console.log(item,'helo comme')
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
    console.log('enter comment', props)
  }

  // <TextInput
  //   placeholder="Enter Name here"
  //   style={styles.textInputStyle}
  //   underlineColorAndroid='transparent'
  // />
  // <FlatList
  //   data={comment}
  //   refreshing={refreshing}
  //   onEndReached={() => loadComment()}
  //   onEndReachedThreshold={0.1}
  //   keyExtractor={data => String(data.post.id)}
  //   renderItem={item => renderRow(item)}
  //   ListFooterComponent={footer}
  // />

  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}> {children}
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      <View style={styles.head}/>
        <KeyboardAvoidingView behavior={(Platform.OS === 'ios') ? "padding" : null} style={styles.form} keyboardVerticalOffset={100}>
            <View style={styles.foot}/>
            <View style={styles.flex}>
                <TextInput placeholder="helo world" style={styles.textInput} onChangeText={txt => setText(txt)} value={text}/>
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
    padding: 40
  },
  textInput: {
    height: 50,
    width: '70%',
    paddingVertical: 0,
    paddingHorizontal: 20
  },
  flex: {
    flexDirection: 'row',
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
