import React, {useState} from 'react';
import {View, StyleSheet, Text, Alert, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {doLogout} from '../../utils/API'

const CustomSidebarMenu = props => {
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [userImage, setUserImage] = useState('')

  let items = [
    {
      navOptionName: 'Home',
      screenToNavigate: 'HomeScreen',
    },
    {
      navOptionName: 'Setting',
      screenToNavigate: 'SettingsScreen',
    },
    {
      navOptionName: 'Pets',
      screenToNavigate: 'PetScreen',
    },
    {
      navOptionName: 'Logout',
      screenToNavigate: 'logout',
    },
  ];

  const handleClick = (index, screenToNavigate) => {
    if (screenToNavigate == 'logout') {
      props.navigation.toggleDrawer();
      Alert.alert(
        'Logout',
        'Are you sure? You want to logout?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              return null;
            },
          },
          {
            text: 'Confirm',
            onPress: () => {
              doLogout(userId).then(res => {
                if(res === 'success') {
                  AsyncStorage.clear();
                  props.navigation.navigate('Auth');
                } else {
                  alert('Failed to logout')
                }
              })
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      props.navigation.toggleDrawer();
      global.currentScreenIndex = screenToNavigate;
      props.navigation.navigate(screenToNavigate);
    }
  };

  const getUserName = async () => {
    const userName = await AsyncStorage.getItem('@user').then(value => {
      setUserName(value)
      return value
    });

    return userName
  }

  const getUserId = async () => {
    const userId = await AsyncStorage.getItem('@session').then(value => {
      console.log(value, '@session')
      setUserId(value)
      return value
    });

    return userId
  }

  const getUserImage = async () => {
    const userImage = await AsyncStorage.getItem('@userImage').then(value => {
      setUserImage(value)
      return value
    });

    return userImage
  }

  getUserId();
  getUserName();
  getUserImage();

  return (
    <View style={stylesSidebar.sideMenuContainer}>
      <View style={stylesSidebar.profileHeader}>
        <View style={stylesSidebar.profileHeaderPicCircle}>
          {/*<Text style={{ fontSize: 25, color: '#307ecc' }}>*/}
          {/*  {userName.charAt(0)}*/}
          {/*</Text>*/}
          <Image source={{uri: userImage || 'https://icon-library.com/images/google-user-icon/google-user-icon-21.jpg'}} style={stylesSidebar.profileHeaderPicCircle}/>
        </View>
        <Text style={stylesSidebar.profileHeaderText}>{userName}</Text>
      </View>
      <View style={stylesSidebar.profileHeaderLine} />
      <View style={{ width: '100%', flex: 1 }}>
        {items.map((item, key) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
              color: 'white',
              backgroundColor:
                global.currentScreenIndex === item.screenToNavigate
                  ? '#4b9ff2'
                  : '#307ecc',
            }}
            key={key}
            onStartShouldSetResponder={() =>
              handleClick(key, item.screenToNavigate)
            }>
            <Text style={{ fontSize: 15, color: 'white' }}>
              {item.navOptionName}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const stylesSidebar = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#307ecc',
    paddingTop: 40,
    color: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: '#307ecc',
    padding: 15,
    textAlign: 'center',
  },
  profileHeaderPicCircle: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    // color: 'white',
    backgroundColor: '#ffffff',
    // textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderText: {
    color: 'white',
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  profileHeaderLine: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#e2e2e2',
    marginTop: 15,
    marginBottom: 10,
  },
});
export default CustomSidebarMenu;
