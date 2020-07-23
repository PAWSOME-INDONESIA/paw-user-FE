import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useRef } from 'react';
import {View, Button, Platform, TouchableOpacity, Linking} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import CountDown from 'react-native-countdown-component';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Container, Item, Input, ListItem, Left, Thumbnail, Body, Text, Right, Icon, Fab } from 'native-base';
import {changePassword} from "../../utils/API";
import Loader from "../Components/Loader";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function SettingsScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [timer, setTimer] = useState(10);
  const [start, setStart] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(false);
  const [showPassContent, setShowPassContent] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [reminder, setReminder] = useState(true);
  const notificationListener = useRef();
  const responseListener = useRef();
    const [active, setActive] = React.useState(false)

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };

  }, []);

  const changePass = () => {
    setIsSaving(true)
    AsyncStorage.getItem('@userEmail').then(res => {
      const param = JSON.stringify({
        "email": res,
        "password": newPass,
        "oldPassword": oldPass
      })
      changePassword(param).then(res => {
        console.log(res, 'helo res')
        if(res === 'success') {
          alert('Password changed successfully')
        } else {
          alert(res)
        }
      })
      setIsSaving(false)
    })
  }

  const setCountDown = (time) => {
    setTimer(time)
    setStart(true)
  }
  return (
    <Container>
      <View style={{ flex: 1 }}>
        <Loader loading={isSaving} />
        <View style={{marginTop: 20}}>
          {/*<Button*/}
          {/*  title="Press to Send Notification"*/}
          {/*  onPress={async () => {*/}
          {/*    await sendPushNotification(expoPushToken);*/}
          {/*  }}*/}
          {/*/>*/}
          <Text style={{marginLeft: 10, fontWeight: 'bold'}}>
            Login Security
          </Text>
          <ListItem thumbnail>
            <Left>
              <Thumbnail square source={{ uri: 'https://cdn0.iconfinder.com/data/icons/instagram-ui-1/24/Instagram-UI_password-512.png' }}
                         style={{width: 35, height: 35}}/>
            </Left>
            <Body>
              <Text>Password</Text>
            </Body>
            <Right>
              <TouchableOpacity onPress={() =>  {
                if(showPassContent){
                  setShowPassContent(false)
                } else {
                  setShowPassContent(true)
                }
              }}>
                {showPassContent && (
                  <AntDesign name="left" size={24} color="black"/>
                )}
                {!showPassContent && (
                  <AntDesign name="right" size={24} color="black"/>
                )}
              </TouchableOpacity>
            </Right>
          </ListItem>
          {showPassContent && (
            <React.Fragment>
              <Item style={{marginLeft: 20, marginRight: 20}}>
                <Input placeholder='Current password' onChangeText={setOldPass} autoCapitalize="none" secureTextEntry/>
              </Item>
              <Item style={{marginLeft: 20, marginRight: 20}}>
                <Input placeholder='New password' onChangeText={setNewPass} autoCapitalize="none" secureTextEntry/>
              </Item>
              <Button title={"Save"} onPress={() => changePass()}/>
            </React.Fragment>
          )}
          <Text style={{marginLeft: 10, fontWeight: 'bold', marginTop: 10}}>
            Set Reminder
          </Text>
          <ListItem thumbnail>
            <Left>
              <Thumbnail square source={{ uri: 'https://d338t8kmirgyke.cloudfront.net/icons/icon_pngs/000/003/037/original/notification.png' }}
                         style={{width: 35, height: 35}}/>
            </Left>
            <Body>
              <Text>Remind Me</Text>
            </Body>
            <Right>
              <TouchableOpacity onPress={() =>  {
                if(showReminder){
                  setShowReminder(false)
                } else {
                  setShowReminder(true)
                }
              }}>
                {showReminder && (
                  <AntDesign name="left" size={24} color="black"/>
                )}
                {!showReminder && (
                  <AntDesign name="right" size={24} color="black"/>
                )}
              </TouchableOpacity>
            </Right>
          </ListItem>
          {showReminder && (
            <React.Fragment>
              <Button title={"10 Min"} onPress={() => setCountDown(100)}/>
              <Button title={"20 Min"} onPress={() => setCountDown(200)}/>
              <Button title={"30 Min"} onPress={() => setCountDown(300)}/>
              {start && (
                <CountDown
                  until={timer}
                  digitStyle={{backgroundColor: '#4485c1'}}
                  digitTxtStyle={{color: '#ffffff'}}
                  timeToShow={['M', 'S']}
                  timeLabels={{m: 'MM', s: 'SS'}}
                  onFinish={async () => {
                    await sendPushNotification(expoPushToken);
                  }}
                  onPress={() => alert('hello')}
                  size={20}
                />
              )}
            </React.Fragment>
          )}
          <Text style={{marginLeft: 10, fontWeight: 'bold', marginTop: 10}}>
            Open Calendar
          </Text>
          <ListItem thumbnail>
            <Left>
              <Thumbnail square source={{ uri: 'https://i.dlpng.com/static/png/5311013-calendar-icon-animal-animals-icon-with-png-and-vector-format-for-calendar-icon-png-512_512_preview.png' }}
                         style={{width: 35, height: 35}}/>
            </Left>
            <Body>
              <Text>Calendar</Text>
            </Body>
            <Right>
              <TouchableOpacity onPress={() =>  {
                if(Platform.OS === 'ios') {
                  Linking.openURL('calshow:');
                } else if(Platform.OS === 'android') {
                  Linking.openURL('content://com.android.calendar/time/');
                }
              }}>
                {showReminder && (
                  <AntDesign name="left" size={24} color="black"/>
                )}
                {!showReminder && (
                  <AntDesign name="right" size={24} color="black"/>
                )}
              </TouchableOpacity>
            </Right>
          </ListItem>
        </View>
        <Fab
          active={active}
          direction="up"
          containerStyle={{ }}
          style={{ backgroundColor: '#5067FF' }}
          position="bottomRight"
          onPress={() => setActive(!active)}>
          <Icon name="share" />
          <Button style={{ backgroundColor: '#34A34F' }}>
            <Icon name="logo-whatsapp" onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=6281344559903')}/>
          </Button>
          <Button style={{ backgroundColor: '#DD5144' }} onPress={() => Linking.openURL('mailto:pawsome@gmail.com?subject=Admin Support&body=QA')}>
            <Icon name="mail" />
          </Button>
          <Button style={{ backgroundColor: '#DD5144' }} onPress={() => {
            if(Platform.OS === 'ios') {
              Linking.openURL('calshow:');
            } else if(Platform.OS === 'android') {
              Linking.openURL('content://com.android.calendar/time/');
            }
          }}>
            <Icon name="alarm" />
          </Button>
        </Fab>
      </View>
    </Container>
  );
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Pawsome',
    body: 'Your pet needs your attention! ',
    data: { data: 'pawsome' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
