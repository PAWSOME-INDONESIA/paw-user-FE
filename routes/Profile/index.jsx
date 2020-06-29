import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import EditProfile from "./EditProfile";

export default function Profile() {
  const [modalVisible, setModalVisible] = useState(false);

  const onEditProfile = () => {
    setModalVisible(!modalVisible)
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: 30, alignItems: 'center', flexDirection: 'row'}}>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} source={require('../../assets/dog.png')}/>
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
        </View>
      </View>
      {/*userName text*/}
      <Text style={styles.userName}>Bill Clinton</Text>
      <Text style={styles.description}>Bill is shit head with multiple body mass index that will be helpful in the future</Text>
      {/*editProfile button*/}
      <TouchableOpacity onPress={onEditProfile} style={styles.editProfile}>
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
      <EditProfile open={modalVisible} close={() => onEditProfile()}/>
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
    width: 75,
    height: 75,
    borderRadius: 68,
    borderWidth: 3,
    borderColor: 'white',
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
    flex: 1
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
  }
});
