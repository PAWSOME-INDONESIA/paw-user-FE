// import React, {useEffect, useReducer, useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity,
//   Dimensions
// } from 'react-native';
// import { Video } from 'expo-av';
// import moment from 'moment';
// import isEmpty from 'lodash/isEmpty';
// import AsyncStorage from "@react-native-community/async-storage";
// import InfiniteScrollView from 'react-native-infinite-scroll-view';
//
// import Comment from "../../components/Comment";
//
// const Reducer = (state, action) => {
//   if(action.type === 'first'){
//     const first = {...state.first};
//
//     first[action.name] = action.value;
//
//     return {
//       ...state,
//       first: first
//     }
//   }
//   return state
// }
//
// export default function Home(props) {
//   const [feed, setFeed] = useState([]);
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [likes, setLikes] = useState(false);
//   const [lastId, setLastId] = useState('');
//   const [lastPage, setLastPage] = useState(false);
//   const [postId, setPostId] = useState('');
//   const [userId, setUserId] = useState('');
//   const [showComment, setShowComment] = useState(false);
//   const [feedDetail, setFeedDetail] = useState('');
//   const [state, dispatch] = useReducer(Reducer, {
//     first: {}
//   })
//
//   useEffect(() => {
//     loadPage();
//   }, [])
//
//   async function loadPage(pageNum = page, shouldRefresh = false, firstFetch = false){
//     if(total && page > total) return;
//
//     // if(lastPage && !shouldRefresh){
//     //   return null
//     // }
//
//     setLoading(true)
//     const token = await AsyncStorage.getItem('@session').then(res =>{return res})
//
//     setUserId(token)
//
//     const response = await fetch(`https://paw-user-yej2q77qka-an.a.run.app/post/following?userID=${token}&lastID=${lastId}&limit=5`, {
//       method: 'get',
//       headers: new Headers({
//         'Content-Type': 'application/x-www-form-urlencoded'
//       })})
//
//     const data = await response.json()
//     const totalItems = response.headers.get('X-Total-Count')
//     const result = data.data.postResponses || {}
//
//
//     // setLastId(result[result.length - 1].post.id)
//     // setTotal(Math.floor(totalItems/5))
//     // setFeed(result)
//     // setPage(pageNum + 1)
//     // setLoading(false)
//     // setLastPage(false)
//
//     if(isEmpty(result)){
//       setLoading(false)
//       setLastPage(true)
//       setLastId('')
//       return null
//     }
//
//     if(firstFetch){
//       setLoading(false)
//       setLastPage(false)
//       setLastId(result[result.length - 1].post.id)
//       setTotal(Math.floor(totalItems/5))
//       setFeed(result)
//       setPage(1)
//       return null
//     } else {
//       setLastId(result[result.length - 1].post.id)
//       setTotal(Math.floor(totalItems/5))
//       setFeed(shouldRefresh ? data : [...feed, ...result])
//       setPage(pageNum + 1)
//       setLoading(false)
//       setLastPage(false)
//     }
//   };
//
//   async function refreshList() {
//     setLastId('')
//     setRefreshing(true)
//
//     await loadPage(1, true, true);
//
//     setRefreshing(false)
//   }
//
//   const PinchableBox = props => {
//
//     const screen = Dimensions.get('window')
//
//     if(props.type === 'video') {
//       return(
//         <Video
//           source={{ uri: props.imageUri }}
//           rate={1.0}
//           volume={1.0}
//           isMuted={true}
//           resizeMode="cover"
//           shouldPlay={false}
//           isLooping
//           style={{ width: screen.width, height: 500 }}
//         />
//       )
//     } else {
//       return (
//         <Image
//           style={{ width: screen.width, height: 500 }}
//           source={{
//             uri: props.imageUri,
//           }}
//         />)
//     }
//   }
//
//   const renderRow = ({item}) => {
//     let likesCount = 0
//
//     setPostId(item.post.id)
//
//     return(
//       <View style={styles.item} key={item.post.id}>
//         <View style={styles.user}>
//           <Image style={{width: 30, height: 30, borderRadius: 50, left: 5}} source={{uri: item.user.imageUrl}} />
//           <Text style={styles.itemText}>{item.user.username}</Text>
//         </View>
//         <PinchableBox imageUri={item.post.imageUrl} type={item.post.type}/>
//         <TouchableOpacity onPress={() => goLike(item.id)}>
//           <View style={styles.likes}>
//             <Image style={{width: 22, height: 22}} source={require('../../assets/paw-empty.png')}/>
//           </View>
//         </TouchableOpacity>
//         <Text style={styles.itemText}>{likesCount} likes</Text>
//         <Text style={{fontWeight: 'bold', paddingLeft: 15}}>
//           {item.user.username}
//           <Text style={{fontWeight: 'normal'}}>
//             {`  ${item.post.caption}`}
//           </Text>
//         </Text>
//           <TouchableOpacity style={{marginTop: 10}} onPress={() => {
//             setShowComment(true)
//             setFeedDetail(item)
//           }}>
//             <Text style={styles.itemText}>{`Show Comment`}</Text>
//           </TouchableOpacity>
//         <View style={styles.createdAt}>
//           <Text style={{fontSize: 11, color: '#a4a4a7'}}>
//             {moment(item.post.created_at).fromNow()}
//           </Text>
//         </View>
//       </View>
//     )
//   };
//
//   const footer = () => {
//     return(
//       loading ? (
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" />
//         </View> ) : null
//     )
//   };
//
//   const goLike = (id) => {
//     // setLikes(!likes)
//   }
//
//   return (
//     <View style={styles.container}>
//       {/*{*/}
//       {/*  showComment && (*/}
//       {/*    <Comment userId={userId} closeComment={() => setShowComment(false)} feedDetail={feedDetail}/>*/}
//       {/*  )*/}
//       {/*}*/}
//        <FlatList
//           data={feed}
//           refreshing={refreshing}
//           onEndReached={() => loadPage()}
//           onEndReachedThreshold={0.1}
//           keyExtractor={data => String(data.post.id)}
//           renderItem={item => renderRow(item)}
//           ListFooterComponent={footer}
//           onRefresh={refreshList}
//           removeClippedSubviews={true}
//         />
//     </View>
//   );
// }
//
// const {width} = Dimensions.get("window");
// const SIZE = width;
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   user: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     alignItems: 'center',
//     marginTop: 15,
//     marginBottom: 15
//   },
//   loader: {
//     marginTop: 10,
//     alignItems: 'center'
//   },
//   item: {
//     backgroundColor: 'white',
//   },
//   likes: {
//     height: 35,
//     width: 35,
//     marginLeft: 15,
//     marginTop: 10,
//   },
//   itemText: {
//     fontSize: 12,
//     padding: 5,
//     marginLeft: 10,
//     bottom: 5
//   },
//   itemText2: {
//     fontSize: 12,
//     padding: 5,
//     marginLeft: 10,
//     bottom: 5,
//     marginBottom: 20
//   },
//   createdAt: {
//     marginBottom: 20,
//     marginLeft: 10,
//     padding: 5,
//   }
// });


import React, {useEffect, useReducer, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions, Animated
} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import {Video} from "expo-av";

import {getUserHomeFeed, likePost, unlikePost, getPostLikeCounter} from "../../utils/API";
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

  if(action.type === 'second'){
    const second = {...state.second};

    second[action.name] = action.value;

    return {
      ...state,
      second: second
    }
  }

  if(action.type === 'third'){
    const third = {...state.third};

    third[action.name] = action.value;

    return {
      ...state,
      third: third
    }
  }

  return state
}

export default function Home(props) {
  const [userFeed, setUserFeed] = useState([]);
  const [userId, setUserId] = useState('');
  const [feedDetail, setFeedDetail] = useState({});
  const [isLiked, setIsLiked] = useState({});
  const [showComment, setShowComment] = useState(false);
  const [state, dispatch] = useReducer(Reducer, {
    first: {},
    second: {},
    third: {}
  })
  useEffect(() => {
    fetchMore()
  },[])

  const fetchMore = () => {
    AsyncStorage.getItem('@session').then(res => {
      setUserId(res)
      let lastId;
      if(userFeed.length > 0){
        lastId = userFeed[userFeed.length - 1].post.id
      } else {
        lastId = ''
      }
      getUserHomeFeed(res, lastId).then(post => {
        if(post.postResponses === null){
          return
        } else {
          setUserFeed([...userFeed, ...post.postResponses])
        }
      })
    })
  }

  const playVideo = (id) => {
    if(state.first[id]){
      dispatch({
        type: 'first',
        name: id,
        value: false
      })
    } else {
      dispatch({
        type: 'first',
        name: id,
        value: true
      })
    }
  }

  const like = (id) => {
    const param = JSON.stringify({
      "postID": id,
      "userID": userId
    })

    // if(state.second[id]){
    //   unlikePost(param).then(res => {
    //     if(res === 'success'){
    //       dispatch({
    //         type: 'deletet',
    //         name: id,
    //         value: false
    //       })
    //     }
    //   })
    //
    // } else {
    //   likePost(param).then(res => {
    //     if(res === 'success'){
    //       dispatch({
    //         type: 'second',
    //         name: id,
    //         value: true
    //       })
    //     }
    //   })
    // }
  }

  const fetchMoreFirst = () => {
    AsyncStorage.getItem('@session').then(res => {
      getUserHomeFeed(res, '').then(post => {
        if(post.postResponses === null){
          return
        } else {
          setUserFeed([...post.postResponses])
        }
      })
    })
  }

  const renderUserFeed = ({item, index}) => {
    const screen = Dimensions.get('window')

    return (
      <View style={styles.item} key={`${item.post.id} ${index}`}>
        <View style={styles.user}>
          <Image style={{width: 30, height: 30, borderRadius: 50, left: 5}} source={{uri: item.user.imageUrl}} />
           <Text style={styles.itemText}>{item.user.username}</Text>
        </View>
        {item.post.type === 'image' &&
          <Image
            source={{uri: item.post.imageUrl}}
            style={{
              width: screen.width,
              height: 500,
              backgroundColor: '#aaa'
            }}
          />
        }
        {item.post.type === 'video' &&
          <TouchableWithoutFeedback onPress={() => playVideo(item.post.id)}>
        <Video
          source={{uri: item.post.imageUrl}}
          style={{
            width: screen.width,
            height: 500,
          }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay={state.first[item.post.id]}
          isLooping
        />
          </TouchableWithoutFeedback>
        }
        <TouchableOpacity onPress={() => like(item.post.id)}>
           <View style={styles.likes}>
             <Image
               style={{width: 22, height: 22}}
               source={require('../../assets/paw-empty.png')}/>
           </View>
         </TouchableOpacity>
          <Text style={styles.itemText}>0 likes</Text>
          <Text style={{fontWeight: 'bold', paddingLeft: 15}}>
              {item.user.username}
            <Text style={{fontWeight: 'normal'}}>
             {`  ${item.post.caption}`}
            </Text>
          </Text>
         <TouchableOpacity style={{marginTop: 10}} onPress={() => {
           setFeedDetail(item)
           setShowComment(true)}}>
            <Text style={{color: 'grey', fontWeight: 'normal', marginLeft: 20, fontSize: 12, marginBottom: 20}}>{`Show Comment`}</Text>
          </TouchableOpacity>
        <View style={styles.createdAt}>
          <Text style={{fontSize: 11, color: '#a4a4a7'}}>
            {moment(item.post.created_at).fromNow()}
          </Text>
        </View>
      </View>
    );
  };

  return(
    <View style={styles.container}>
      {showComment && (<Comment userId={userId} closeComment={() => setShowComment(false)} feedDetail={feedDetail}/>)}
      <Animated.FlatList
        data={userFeed}
        scrollToOverflowEnabled={true}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.1}
        renderItem={renderUserFeed}
        onRefresh={fetchMoreFirst}
        refreshing={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  user: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15
  },
  loader: {
    marginTop: 10,
    alignItems: 'center'
  },
  item: {
    backgroundColor: 'white',
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
    bottom: 5,
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
