import React from 'react';
import {Image, KeyboardAvoidingView, StyleSheet, View} from "react-native";
import LoginForm from "./LoginForm/loginForm";
import { getToken } from "../../utils/store";
import {getUser} from "../../utils/API";
import {normalizeUserData} from "../../utils/normalizeUserProfile";

export default function Login({navigation}) {
  getToken().then(res => {
    if(res) {
      getUser(res).then(
        result => {
          navigation.navigate("Home", normalizeUserData(result))
        }
      )
    }
  })

  return(
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/ggwp.png')}
          style={styles.logo}
        />
      </View>
      <LoginForm
        onClick={(res) => {
          const goTo = res.goTo;
          navigation.navigate(goTo, normalizeUserData(res.user))
        }}
        navi={navigation}/>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF914D'
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        width: 200,
        height: 200
    },
    title: {
        color: '#ffffff',
        marginTop: 10
    }
})
