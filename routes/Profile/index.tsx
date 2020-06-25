import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet, Text, View, Dimensions, Image, Button} from 'react-native';

export default function Profile() {
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
      {/*editProfile button*/}
      <View style={styles.editProfile}>
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </View>
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
  }
});
