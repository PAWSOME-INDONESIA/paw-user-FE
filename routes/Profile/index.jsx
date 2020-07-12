import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity, AsyncStorage, FlatList, ActivityIndicator,
} from 'react-native';

import Lightbox from 'react-native-lightbox';

import EditProfile from "./EditProfile";
import Pets from "./Pets";
import isEmpty from "react-native-web/dist/vendor/react-native/isEmpty";

const WINDOW_WIDTH = Dimensions.get('window').width;
const BASE_PADDING = 10;

export default function Profile(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPet, setModalPet] = useState(false);
  const [userProfile, setUserProfile] = useState(props.userProfile);

  async function refreshList() {
    props.setRefreshing(true)
    props.load(1, true)
    props.setRefreshing(false)
  }

  const renderRow = ({item}) => {

    const image = () => {
      return(
        <Image
          style={[styles.square2, styles.squareFirst2]}
          resizeMode="cover"
          source={{ uri: item.imageUrl }}
        />
      )
    }

    return(
      <Lightbox style={styles.col} renderContent={image} springConfig={{ overshootClamping: true }} swipeToDismiss={true}>
        <Image
          style={[styles.square, styles.squareFirst]}
          resizeMode="cover"
          source={{ uri: item.imageUrl }}
        />
      </Lightbox>
    )
  };

  const footer = () => {
    return(
      props.loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View> ) : null
    )
  };

  const onEditProfile = (value) => {
    setUserProfile(value)
    props.updateUserProfile(value)
    toggleModalEditProfile()
  };

  const toggleModalEditProfile = () => {
    setModalVisible(!modalVisible)
  }

  const toggleModalPet = () => {
    setModalPet(!modalPet)
  };

  const imgUrl = isEmpty(userProfile.imageUrl) ? require('../../assets/dog.png') : { uri: userProfile.imageUrl}

  return (
    <View style={styles.container}>
      <View style={{marginTop: 25, alignItems: 'center', flexDirection: 'row'}}>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} source={imgUrl}/>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>{props.post.length}</Text>
            <Text style={styles.statTitle}>post</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>{props.totalFollowers}</Text>
            <Text style={styles.statTitle}>followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>{props.totalFollowings}</Text>
            <Text style={styles.statTitle}>following</Text>
          </View>
          <TouchableOpacity style={styles.stat} onPress={toggleModalPet}>
            <Text style={styles.statAmount}>{props.totalPets}</Text>
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
      <View style={{height: 475}}>
        <FlatList
          // style={{marginLeft: 5}}
          data={props.post}
          refreshing={props.refreshing}
          onEndReached={() => props.load()}
          onEndReachedThreshold={0.1}
          keyExtractor={post => String(post.id)}
          renderItem={item => renderRow(item)}
          ListFooterComponent={footer}
          onRefresh={refreshList}
          numColumns={3}
        />
      </View>
      <Pets open={modalPet} close={()=> toggleModalPet}/>
      <EditProfile open={modalVisible} editProfile={(res) => onEditProfile(res)} close={()=> toggleModalEditProfile()} userProfile={userProfile}/>
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
  user: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
    alignItems: 'center',
    marginTop: 5
  },
  loader: {
    marginTop: 30,
    alignItems: 'center'
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
  }
});
