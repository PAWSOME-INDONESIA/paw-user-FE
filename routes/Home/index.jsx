import React, {useEffect, useReducer, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions, ImageBackground
} from 'react-native';

import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

import { PinchGestureHandler, State } from 'react-native-gesture-handler'
import AsyncStorage from "@react-native-community/async-storage";

import { getPostLikeCounter, getCommentCount }  from '../../utils/API'
import Comment from "../../components/Comment";

const Reducer = (state, action) => {
  if(action.type === 'first'){
    const first = {...state.first};

    first[action.name] = action.value;

    return {
      ...state,
      first: first
    }
  }
  return state
}

export default function Home(props) {

  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [likes, setLikes] = useState(false);
  const [lastId, setLastId] = useState('');
  const [lastPage, setLastPage] = useState(false);
  const [postId, setPostId] = useState('');
  const [userId, setUserId] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [state, dispatch] = useReducer(Reducer, {
    first: {}
  })

  useEffect(() => {
    loadPage();
  }, [])

  async function loadPage(pageNum = page, shouldRefresh = false, firstFetch = false){
    if(total && page > total) return;

    if(lastPage && !shouldRefresh){
      return null
    }

    setLoading(true)
    const token = await AsyncStorage.getItem('@session').then(res =>{return res})

    setUserId(token)

    const response = await fetch(`https://paw-user-yej2q77qka-an.a.run.app/post/following?userID=${token}&lastID=${lastId}&limit=2`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })})

    const data = await response.json()
    const totalItems = response.headers.get('X-Total-Count')
    const result = data.data.postResponses || {}

    if(isEmpty(result)){
      setLoading(false)
      setLastPage(true)
      setLastId('')
      return null
    }

    if(firstFetch){
      setLoading(false)
      setLastPage(false)
      setLastId(result[result.length - 1].post.id)
      setTotal(Math.floor(totalItems/1))
      setFeed(result)
      setPage(1)
      return null
    } else {
      setLastId(result[result.length - 1].post.id)
      setTotal(Math.floor(totalItems/1))
      setFeed(shouldRefresh ? data : [...feed, ...result])
      setPage(pageNum + 1)
      setLoading(false)
      setLastPage(false)
    }
  };

  async function refreshList() {
    setLastId('')
    setRefreshing(true)

    await loadPage(1, true, true);

    setRefreshing(false)
  }

  const PinchableBox = props => {
    const scale = new Animated.Value(1)
    const onPinchEvent = Animated.event(
      [
        {
          nativeEvent: { scale: scale }
        }
      ],
      {
        useNativeDriver: true
      }
    )
    const onPinchStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true
        }).start()
      }
    }
    const screen = Dimensions.get('window')

    return (
      <PinchGestureHandler
        onGestureEvent={onPinchEvent}
        onHandlerStateChange={onPinchStateChange}>
        <Animated.Image
          source={{ uri: props.imageUri|| 'https://www.alwaysayurveda.com/wp-content/uploads/2015/07/image-not-available.jpg' }}
          style={{
            width: screen.width,
            height: 500,
            transform: [{ scale: scale }],
            zIndex: 10,
          }}
          transition="opacity"
          resizeMode='cover'
        />
      </PinchGestureHandler>
    )
  }

  const renderRow = ({item}) => {
    let lastTap = null;
    const handleDoubleTap = (id) => {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 300;
      if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
        goLike(id);
      } else {
        lastTap = now;
      }
    }
    let likesCount = 0
    let commentCount = 0

    getPostLikeCounter(item.post.id).then(res => {
      likesCount = res.likesCount
    })

    getCommentCount(item.post.id).then(res => {
      commentCount = res
    })

    setPostId(item.post.id)

    const likeStatus = likes ? require('../../assets/paw-filled.png') : require('../../assets/paw-empty.png')
    return(
      <View style={styles.item}>
        <View style={styles.user}>
          <Image style={{width: 30, height: 30, borderRadius: 50, left: 5}} source={{uri: item.user.imageUrl}} />
          <Text style={styles.itemText}>{item.user.username}</Text>
        </View>
        <PinchableBox imageUri={item.post.imageUrl}/>
        <TouchableOpacity onPress={() => goLike(item.id)}>
          <View style={styles.likes}>
            <Image style={{width: 22, height: 22}} source={likeStatus}/>
          </View>
        </TouchableOpacity>
        <Text style={styles.itemText}>{likesCount} likes</Text>
        <Text style={{fontWeight: 'bold', paddingLeft: 15}}>
          {item.user.username}
          <Text style={{fontWeight: 'normal'}}>
            {`  ${item.post.caption}`}
          </Text>
        </Text>
        {
          commentCount === 0 && commentCount < 3 &&
          <TouchableOpacity style={{marginTop: 15}} onPress={() => setShowComment(true)}>
            <Text style={styles.itemText}>Add Comment</Text>
          </TouchableOpacity>
        }
        <View style={styles.createdAt}>
          <Text style={{fontSize: 11, color: '#a4a4a7'}}>
            {moment(item.post.created_at).fromNow()}
          </Text>
        </View>
      </View>
    )
  };

  const footer = () => {
    return(
      loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View> ) : null
    )
  };

  const goLike = (id) => {
    setLikes(!likes)
  }

  return (
    <View style={styles.container}>
      {showComment ? (
        <View>
          <Comment postId={postId} userId={userId}/>
        </View>
      ) : <FlatList
        data={feed}
        refreshing={refreshing}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        keyExtractor={data => String(data.post.id)}
        renderItem={item => renderRow(item)}
        ListFooterComponent={footer}
        onRefresh={refreshList}
      />}
    </View>
  );
}

const {width} = Dimensions.get("window");
const SIZE = width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  user: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginBottom: 5,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15
  },
  loader: {
    marginTop: 10,
    alignItems: 'center'
  },
  item: {
    backgroundColor: 'white'
  },
  itemImage: {
    width: SIZE,
    height: SIZE,
    resizeMode: 'cover'
  },
  likes: {
    height: 35,
    width: 35,
    marginLeft: 15,
    marginTop: 10,
  },
  itemText: {
    fontSize: 12,
    padding: 5,
    marginLeft: 10,
    bottom: 5
  },
  itemText2: {
    fontSize: 12,
    padding: 5,
    marginLeft: 10,
    bottom: 5,
    marginBottom: 20
  },
  createdAt: {
    marginBottom: 20,
    marginLeft: 10,
    padding: 5,
  }
});
