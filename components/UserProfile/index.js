import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator,
  TouchableHighlight
} from 'react-native';

import { Video } from 'expo-av';

import {TabView, TabBar} from 'react-native-tab-view';

import AsyncStorage from '@react-native-community/async-storage';

import EditProfile from "../../routes/Profile/EditProfile";
import Post from '../../routes/Profile/Post';
import Pets from "../../routes/Profile/Pets";

import {
  getFollowers,
  getFollowings,
  getUser,
  getPet,
  getUserPost,
  getCheckFollowStatus,
  unfollowUser, followUser
} from "../../utils/API";
import {translate} from '../../utils/i18n'
import Comment from "../../components/Comment";
import {Ionicons} from "@expo/vector-icons";

const TabBarHeight = 48;
const HeaderHeight = 270;
const tab1ItemSize = (Dimensions.get('window').width - 30) / 2;
const tab2ItemSize = (Dimensions.get('window').width - 40) / 3;
const WINDOW_WIDTH = Dimensions.get('window').width;
const BASE_PADDING = 10;

class TabScene extends React.Component {
  render = () => {
    const windowHeight = Dimensions.get('window').height;
    const {
      numCols,
      data,
      renderItem,
      onGetRef,
      scrollY,
      onScrollEndDrag,
      onMomentumScrollEnd,
      onMomentumScrollBegin,
      fetchMore,
    } = this.props;

    return (
      <Animated.FlatList
        scrollToOverflowEnabled={true}
        numColumns={numCols}
        ref={onGetRef}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        ItemSeparatorComponent={() => <View style={{height: 10}} />}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        contentContainerStyle={{
          paddingTop: HeaderHeight + TabBarHeight,
          paddingHorizontal: 10,
          minHeight: windowHeight - TabBarHeight,
        }}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.1}
      />
    );

    return null
  };
}

export default function UserProfile(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPet, setModalPet] = useState(false);
  const [modalPost, setModalPost] = useState(false);
  const [modalFollowers, setModalFollowers] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [userPost, setUserPost] = useState([]);
  const [pet, setPet] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [userPostDetail, setUserPostDetail] = useState({});
  const [userPetDetail, setUserPetDetail] = useState({});
  const [currentUser, setCurrentUser] = useState('');
  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'tab1', title: 'Posts'},
    {key: 'tab2', title: 'Pets'},
  ]);
  const scrollY = useRef(new Animated.Value(0)).current;
  let listRefArr = useRef([]);
  let listOffset = useRef({});
  let isListGliding = useRef(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false)
  }, [userPost])

  useEffect(() => {
    setLoading(false)
  }, [pet])

  useEffect(() => {
    scrollY.addListener(({value}) => {
      const curRoute = routes[tabIndex].key;
      listOffset.current[curRoute] = value;
    });
    return () => {
      scrollY.removeAllListeners();
    };
  }, [routes, tabIndex]);

  useEffect(() => {
    getUser(props.uProfile.id).then(usr => {
      setUserProfile(usr)
    })
    getFollowers(props.uProfile.id).then(followers => {
      setFollowers(followers)
    })
    getFollowings(props.uProfile.id).then(followings => {
      setFollowings(followings)
    })
    getPet(props.uProfile.id, 'false').then(pet => {
      setPet(pet)
    })
    getUserPost(props.uProfile.id, '').then(post => {
      setUserPost(post)
    })

    AsyncStorage.getItem('@session').then(value => {
      setCurrentUser(value)
      getCheckFollowStatus(value, props.uProfile.id).then(follow => {
        setIsFollowed(follow)
        setIsFetched(true)
      })
    });

  }, [])

  useEffect(() => {
    getFollowers(props.uProfile.id).then(followers => {
      setFollowers(followers)
    })
    getFollowings(props.uProfile.id).then(followings => {
      setFollowings(followings)
    })
  }, [isFollowed])

  const onEditProfile = (value) => {
    setUserProfile(value)
    toggleModalEditProfile()
  };

  const toggleModalEditProfile = () => {
    setModalVisible(!modalVisible)
  }

  const toggleModalPet = () => {
    setModalPet(!modalPet)
  };

  const toggleModalFollowers = () => {
    setModalFollowers(!modalFollowers)
  };

  const togglePostDetail = () => {
    setModalPost(!modalPost)
  };

  const fetchMore = () => {
    userPost[userPost.length - 1].id;
    getUserPost(props.uProfile.id, userPost[userPost.length - 1].id).then(post => {
      if(post === null){
        return
      } else {
        setUserPost([...userPost, ...post])
      }
    })
  }

  const syncScrollOffset = () => {
    const curRouteKey = routes[tabIndex].key;
    listRefArr.current.forEach((item) => {
      if (item.key !== curRouteKey) {
        if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
          if (item.value) {
            if(item.value._component){
              item.value._component.scrollToOffset({
                offset: scrollY._value,
                animated: false,
              });
            }
            listOffset.current[item.key] = scrollY._value;
          }
        } else if (scrollY._value >= HeaderHeight) {
          if (
            listOffset.current[item.key] < HeaderHeight ||
            listOffset.current[item.key] == null
          ) {
            if (item.value) {
              if(item.value._component){
                item.value._component.scrollToOffset({
                  offset: HeaderHeight,
                  animated: false,
                });
              }
              listOffset.current[item.key] = HeaderHeight;
            }
          }
        }
      }
    });
  };

  const onMomentumScrollBegin = () => {
    isListGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isListGliding.current = false;
    syncScrollOffset();
  };

  const onScrollEndDrag = () => {
    syncScrollOffset();
  };

  const deletePost = (id) => {
    const filteredItems = userPost.filter(item => item.id !== id)
    setUserPost(filteredItems)
  }

  const deletePet = (id) => {
    const filteredItems = pet.filter(item => item.id !== id)
    setPet(filteredItems)
  }

  const editPet = (uPet) => {
    const filteredItems = pet.filter(item => item.id !== uPet.id)
    setPet([...filteredItems, uPet])
  }

  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight],
      extrapolateRight: 'clamp',
    });

    return (
      <Animated.View style={[styles.header, {transform: [{translateY: y}]}]}>
        <TouchableOpacity onPress={() => {
          props.closeUProfile()
        }} style={{right:170, top: 10, flexDirection: 'row'}}>
          <Ionicons name="ios-arrow-back" size={30} color="blue" />
          <Text style={{left: 20, top: 6, fontWeight: 'bold'}}>Back</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 30}}>
          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={{uri: userProfile.imageUrl || 'https://icon-library.com/images/google-user-icon/google-user-icon-21.jpg'}}/>
          </View>

          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.stat} onPress={() => setIndex(0)}>
              <Text style={styles.statAmount}>{userPost && userPost.length || 0}</Text>
              <Text style={styles.statTitle}>post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stat} onPress={toggleModalFollowers}>
              <Text style={styles.statAmount}>{followers.length}</Text>
              <Text style={styles.statTitle}>followers</Text>
            </TouchableOpacity>
            <View style={styles.stat}>
              <Text style={styles.statAmount}>{followings.length}</Text>
              <Text style={styles.statTitle}>following</Text>
            </View>
            <TouchableOpacity style={styles.stat} onPress={() => setIndex(1)}>
              <Text style={styles.statAmount}>{pet.length}</Text>
              <Text style={styles.statTitle}>pets</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{height: '20%', width: '100%'}}>

          {/*userName text*/}
          <Text style={styles.userName}>{userProfile.username}</Text>
          <Text style={styles.description}>{userProfile.bio}</Text>

          {/*editProfile button*/}
          {isFetched && isFollowed && (
            <TouchableOpacity onPress={() => {
              const param = JSON.stringify({
                "userID": props.uProfile.id,
              })
              unfollowUser(currentUser, param).then(res => {
                if(res === 'success') {
                  setIsFollowed(false)
                }
              })
            }} style={styles.editProfile}>
              <Text style={styles.editProfileText}>Unfollow</Text>
            </TouchableOpacity>
          )}
          {isFetched && !isFollowed && (
            <TouchableOpacity onPress={() => {
              const param = JSON.stringify({
                "userID": props.uProfile.id,
              })
              followUser(currentUser, param).then(res => {
                if(res === 'success') {
                  setIsFollowed(true)
                }
              })
            }} style={styles.editProfile}>
              <Text style={styles.editProfileText}>Follow</Text>
            </TouchableOpacity>
          )}

          <Pets
            visible={modalPet}
            onClose={toggleModalPet}
            pet={userPetDetail}
            deletePet={id => deletePet(id)}
            userProfile={userProfile}
            updatePet={uPet => editPet(uPet)}
            notEditable
          />

          <EditProfile open={modalVisible} editProfile={(res) => onEditProfile(res)} close={()=> toggleModalEditProfile()} userProfile={userProfile}/>
          <Post visible={modalPost} onClose={togglePostDetail} post={userPostDetail} userProfile={userProfile} showComment={() => setShowComment(true)} notEditable/>
        </View>
      </Animated.View>
    );
  };

  const renderUserPet = ({item, index}) => {
    const longPress =()=> {
      toggleModalPet()
      setUserPetDetail(item)
    }
    return (
      <View>
        <TouchableOpacity onPress={longPress}>
          <Image
            source={{uri: item.imageUrl}}
            style={{
              borderRadius: 16,
              marginLeft: index % 2 === 0 ? 0 : 10,
              width: tab1ItemSize,
              height: tab1ItemSize,
              backgroundColor: '#aaa',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderUserPost = ({item, index}) => {
    const longPress =()=> {
      togglePostDetail()
      setUserPostDetail(item)
    }

    return (
      <View>
        <TouchableOpacity onPress={longPress}>
          {item.type === 'image' && (
            <Image
              source={{uri: item.imageUrl}}
              style={{
                marginLeft: index % 3 === 0 ? 0 : 10,
                borderRadius: 16,
                width: tab2ItemSize,
                height: tab2ItemSize,
                backgroundColor: '#aaa',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          )}
          {item.type === 'video' && (
            <Video
              source={{ uri: item.imageUrl }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay={false}
              isLooping
              style={{
                marginLeft: index % 3 === 0 ? 0 : 10,
                borderRadius: 16,
                width: tab2ItemSize,
                height: tab2ItemSize,
                backgroundColor: '#aaa',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderLabel = ({route, focused}) => {
    return (
      <Text style={[styles.label, {opacity: focused ? 1 : 0.5}]}>
        {route.title}
      </Text>
    );
  };

  const renderScene = ({route}) => {
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let data;
    let renderItem;
    switch (route.key) {
      case 'tab1':
        numCols = 3;
        data = userPost;
        renderItem = renderUserPost;
        break;
      case 'tab2':
        numCols = 2;
        data = pet;
        renderItem = renderUserPet ;
        break;
      default:
        return null;
    }
    return (
      <TabScene
        numCols={numCols}
        data={data}
        renderItem={renderItem}
        scrollY={scrollY}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        fetchMore={fetchMore}
        onGetRef={(ref) => {
          if (ref) {
            const found = listRefArr.current.find((e) => e.key === route.key);
            if (!found) {
              listRefArr.current.push({
                key: route.key,
                value: ref,
              });
            }
          }
        }}
      />
    );
  };

  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight, 0],
      extrapolateRight: 'clamp',
    });
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,
          position: 'absolute',
          transform: [{translateY: y}],
          width: '100%',
        }}>
        <TabBar
          {...props}
          onTabPress={({route, preventDefault}) => {
            if (isListGliding.current) {
              preventDefault();
            }
          }}
          style={styles.tab}
          renderLabel={renderLabel}
          indicatorStyle={styles.indicator}
        />
      </Animated.View>
    );
  };

  const renderTabView = () => {
    return (
      <TabView
        onIndexChange={(index) => setIndex(index)}
        navigationState={{index: tabIndex, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{
          height: 0,
          width: Dimensions.get('window').width,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {loading ? <ActivityIndicator color="#0000ff" style={{top: '50%', }} size="large"/> : (
        <View style={{flex: 1}}>
          {showComment ? (
            <Comment userId={props.uProfile.id} closeComment={() => setShowComment(false)} feedDetail={{post: userPostDetail}}/>
          ) : (
            <React.Fragment>
              {renderTabView()}
              {renderHeader()}
            </React.Fragment>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: 'white'
  },
  avatarContainer : {
    shadowColor: '#151734',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    left: 15
  },
  avatar : {
    marginBottom: 10,
    width: 75,
    height: 75,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'black',
  },
  userName : {
    marginTop: 15,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '600'
  },
  description : {
    marginTop: 15,
    marginLeft: 15,
    fontSize: 14,
  },
  statsContainer : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 30
  },
  stat : {
    alignItems: 'center',
    flex: 3
  },
  statAmount: {
    color: 'grey',
    fontWeight: '300'
  },
  statTitle: {
    color: 'grey',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4
  },
  editProfile: {
    width: 300,
    left: 35,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15,
    borderRadius: 20,
    backgroundColor: 'black',
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', // Centered horizontally
    height: 35
  },
  editProfileText: {
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    bottom: -20,
  },
  modalView: {
    margin: 20,
    width: '100%',
    height: '95%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  itemImage: {
    width: 120,
    height: 120
  },
  item: {
    marginTop: 10,
    height: 500
  },
  loader: {
    marginTop: 30,
    alignItems: 'center'
  },
  col: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',
  },
  square: {
    width: WINDOW_WIDTH - BASE_PADDING * 27.6,
    height: WINDOW_WIDTH - BASE_PADDING * 30,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  squareFirst: {
    backgroundColor: 'black',
  },
  square2: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  squareFirst2: {
    backgroundColor: 'black',
  },
  header: {
    top: 0,
    height: 270,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    // justifyContent: 'center',
    position: 'absolute',
  },
  label: {fontSize: 16, color: '#222'},
  tab: {elevation: 0, shadowOpacity: 0, backgroundColor: 'white'},
  indicator: {backgroundColor: '#222'},
});
