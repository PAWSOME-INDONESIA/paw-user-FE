import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity, AsyncStorage, FlatList, TouchableWithoutFeedback, ActivityIndicator,
} from 'react-native';
import EditProfile from "./EditProfile";
import Pets from "./Pets";
import {editUser, getUserPost} from "../../utils/API";

export default function Profile(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPet, setModalPet] = useState(false);
  const [userProfile, setUserProfile] = useState(props.userProfile);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(()=> {
    loadPosts();
  },[])

  async function loadPosts(pageNum = page, shouldRefresh = false){

    if(total && page > total) return;

    const store = await AsyncStorage.getItem('@session').then(res => {return res})

    let value = store;
    value = value.replace(/^"|"$/g, '');

    setLoading(true)

    const response = await fetch(`https://paw-user-yej2q77qka-an.a.run.app/post/user-profile?userID=${value}&lastID=&limit=3`)

    const data = await response.json()
    const totalItems = response.headers.get('X-Total-Count')

    setTotal(Math.floor(totalItems/1))
    setPosts(shouldRefresh ? data.data.posts : [...posts, ...data.data.posts])
    setPage(pageNum + 1)
    setLoading(false)
  };

  async function refreshList() {
    setRefreshing(true)

    await loadPosts(1, true);

    setRefreshing(false)
  }

  const renderRow = ({item}) => {
    let lastTap = null;
    const handleDoubleTap = (id) => {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 300;
      if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
        // goLike(id);
      } else {
        lastTap = now;
      }
    }

    // const likeStatus = likes ? require('../../assets/paw-filled.png') : require('../../assets/paw-empty.png')

    return(
      <View style={styles.item}>
        {/*<View style={styles.user}>*/}
        {/*  <Image style={{width: 30, height: 30}} source={require('../../assets/dog.png')} />*/}
        {/*  <Text style={styles.itemText}>Clement</Text>*/}
        {/*</View>*/}
        {/*<TouchableWithoutFeedback onPress={() => handleDoubleTap(item.id)}>*/}
          <Image style={styles.itemImage} source={{uri: item.imageUrl}} />
        {/*</TouchableWithoutFeedback>*/}
        {/*<TouchableOpacity onPress={() => goLike(item.id)}>*/}
        {/*  <View style={styles.likes}>*/}
        {/*    <Image style={{width: 22, height: 22}} source={likeStatus}/>*/}
        {/*  </View>*/}
        {/*</TouchableOpacity>*/}
        {/*<Text style={styles.itemText}>100 likess</Text>*/}
        {/*<Text style={styles.itemText}>{item.title}</Text>*/}
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

  return (
    <View style={styles.container}>
      <View style={{marginTop: 30, alignItems: 'center', flexDirection: 'row'}}>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} source={{ uri: userProfile.imageUrl} || require('../../assets/dog.png')}/>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>999</Text>
            <Text style={styles.statTitle}>post</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>999</Text>
            <Text style={styles.statTitle}>followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>999</Text>
            <Text style={styles.statTitle}>following</Text>
          </View>
          <TouchableOpacity style={styles.stat} onPress={toggleModalPet}>
            <Text style={styles.statAmount}>3</Text>
            <Text style={styles.statTitle}>pets</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/*userName text*/}
      <Text style={styles.userName}>{userProfile.username}</Text>
      <Text style={styles.description}>{userProfile.bio}</Text>
      {/*editProfile button*/}
      <TouchableOpacity onPress={toggleModalEditProfile} style={styles.editProfile}>
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
      <Pets open={modalPet} close={()=> toggleModalPet}/>
      <EditProfile open={modalVisible} editProfile={(res) => onEditProfile(res)} close={()=> toggleModalEditProfile()} userProfile={userProfile}/>
      <FlatList
        data={posts}
        refreshing={refreshing}
        onEndReached={() => loadPosts()}
        onEndReachedThreshold={0.1}
        keyExtractor={post => String(post.id)}
        renderItem={item => renderRow(item)}
        ListFooterComponent={footer}
        onRefresh={refreshList}
        numColumns={3}
      />
    </View>
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
  }
});
