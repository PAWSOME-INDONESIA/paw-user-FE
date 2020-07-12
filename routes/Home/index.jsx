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
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';

import { PinchGestureHandler, State } from 'react-native-gesture-handler'

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

export default function Home({route, navigation}) {

  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [likes, setLikes] = useState(false);
  const [state, dispatch] = useReducer(Reducer, {
    first: {}
  })

  // console.log(route.params,'helo params')

  useEffect(() => {
    loadPage();
  }, [])

  async function loadPage(pageNum = page, shouldRefresh = false){
    if(total && page > total) return;

    setLoading(true)

    const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${pageNum}`)

    const data = await response.json()
    const totalItems = response.headers.get('X-Total-Count')

    setTotal(Math.floor(totalItems/5))
    setFeed(shouldRefresh ? data : [...feed, ...data])
    setPage(pageNum + 1)
    setLoading(false)
  };

  async function refreshList() {
    setRefreshing(true)

    await loadPage(1, true);

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
          source={{ uri: props.imageUri }}
          style={{
            width: screen.width,
            height: 500,
            transform: [{ scale: scale }],
            zIndex: 10,
          }}
          transition="opacity"
          resizeMode='contain'
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

    const likeStatus = likes ? require('../../assets/paw-filled.png') : require('../../assets/paw-empty.png')

    return(
      <View style={styles.item}>
        <View style={styles.user}>
          <Image style={{width: 30, height: 30}} source={require('../../assets/dog.png')} />
          <Text style={styles.itemText}>{item.id}</Text>
        </View>
        {/*<TouchableWithoutFeedback onPress={() => handleDoubleTap(item.id)}>*/}
        {/*  /!*<Image*!/*/}
        {/*  /!*  style={[styles.itemImage]}*!/*/}
        {/*  /!*  source={{uri: item.url}} />*!/*/}
        {/*</TouchableWithoutFeedback>*/}
        <PinchableBox imageUri={item.url}/>
        <TouchableOpacity onPress={() => goLike(item.id)}>
          <View style={styles.likes}>
            <Image style={{width: 22, height: 22}} source={likeStatus}/>
          </View>
        </TouchableOpacity>
        <Text style={styles.itemText}>100 likess</Text>
        <Text style={styles.itemText}>{item.title}</Text>
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
      <FlatList
        data={feed}
        refreshing={refreshing}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        keyExtractor={post => String(post.id)}
        renderItem={item => renderRow(item)}
        ListFooterComponent={footer}
        onRefresh={refreshList}
      />
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
    marginBottom: 5,
    alignItems: 'center',
    marginTop: 5
  },
  loader: {
    marginTop: 10,
    alignItems: 'center'
  },
  item: {
    marginBottom: 20
  },
  itemImage: {
    width: SIZE,
    height: SIZE,
    resizeMode: 'cover'
  },
  likes: {
    height: 35,
    width: 35,
    marginLeft: 10,
    marginTop: 5,
  },
  itemText: {
    fontSize: 12,
    padding: 5,
    bottom: 5
  },
});
