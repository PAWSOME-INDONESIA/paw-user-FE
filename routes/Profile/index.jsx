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

import EditProfile from "./EditProfile";
import Post from './Post';
import Pets from "./Pets";

import {getFollowers, getFollowings, getUser, getPet, getUserPost} from "../../utils/API";
import {translate} from '../../utils/i18n'
import Comment from "../../components/Comment";
import Follower from "../../components/Follower";

const TabBarHeight = 48;
const HeaderHeight = 250;
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

export default function Profile(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPet, setModalPet] = useState(false);
  const [modalPost, setModalPost] = useState(false);
  const [modalFollowers, setModalFollowers] = useState(false);
  const [modalFollowings, setModalFollowings] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [pet, setPet] = useState([]);
  const [userPost, setUserPost] = useState([]);
  const [userPostDetail, setUserPostDetail] = useState({});
  const [userPetDetail, setUserPetDetail] = useState({});
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
    console.toString(props, 'helo')
  }, [])

  useEffect(() => {
    if(props.route.params && props.route.params.loadPage && props.route.params.userPost){
      setLoading(true)
      setIndex(0)
      console.log(props.route, userPost)
      setUserPost([props.route.params.userPost, ...userPost])
    }
    if(props.route.params && props.route.params.loadPage && props.route.params.userPet){
      setLoading(true)
      setIndex(1)
      setPet([...pet, props.route.params.userPet])
    }
    updateProfile()
  }, [props.route.params])

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

  const updateProfile = () => {
    AsyncStorage.getItem('@session').then(res => {
      getUser(res).then(usr => {
        setUserProfile(usr)
      })
      getFollowers(res).then(followers => {
        setFollowers(followers)
      })
      getFollowings(res).then(followings => {
        setFollowings(followings)
      })
      getPet(res, 'false').then(pet => {
        setPet(pet)
      })
      getUserPost(res, '').then(post => {
        setUserPost(post)
      })
    })
  }

  useEffect(() => {
    updateProfile()
  }, [])

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

  const toggleModalFollowings = () => {
    setModalFollowings(!modalFollowings)
  };

  const togglePostDetail = () => {
    setModalPost(!modalPost)
  };

  const fetchMore = () => {
    AsyncStorage.getItem('@session').then(res => {
      userPost[userPost.length - 1].id;
      getUserPost(res, userPost[userPost.length - 1].id).then(post => {
        if(post === null){
          return
        } else {
          setUserPost([...userPost, ...post])
        }
      })
    })
  }

  if(modalFollowings ){
    return(
      <Follower open={modalFollowings} close={() => toggleModalFollowings()} followers={followings}/>
    )
  }

  if(modalFollowers) {
    return(
      <Follower open={modalFollowers} close={() => toggleModalFollowers()} followers={followers}/>
    )
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
            <TouchableOpacity style={styles.stat} onPress={toggleModalFollowings}>
              <Text style={styles.statAmount}>{followings.length}</Text>
              <Text style={styles.statTitle}>following</Text>
            </TouchableOpacity>
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
          <TouchableOpacity onPress={toggleModalEditProfile} style={styles.editProfile}>
            <Text style={styles.editProfileText}>{translate(global.userLang, 'editProfile')}</Text>
          </TouchableOpacity>

          <Pets
            visible={modalPet}
            onClose={toggleModalPet}
            pet={userPetDetail}
            deletePet={id => deletePet(id)}
            userProfile={userProfile}
            updatePet={uPet => editPet(uPet)}
          />
          <EditProfile open={modalVisible} editProfile={(res) => onEditProfile(res)} close={()=> toggleModalEditProfile()} userProfile={userProfile}/>
          <Post visible={modalPost} onClose={togglePostDetail} post={userPostDetail} deletePost={id => deletePost(id)} userProfile={userProfile} showComment={() => setShowComment(true)}/>
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
            <Comment userId={userProfile.id} closeComment={() => setShowComment(false)} feedDetail={{post: userPostDetail}}/>
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
    height: 250,
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
