import React from 'react';
import {Image, KeyboardAvoidingView, StyleSheet, View} from "react-native";
import LoginForm from "./LoginForm/loginForm";
import {getToken} from "../../utils/store";

export default function Login({navigation}) {
  getToken().then(res => {
    if(res) {
      navigation.navigate('Home')
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
          const user = res.user
          navigation.navigate(goTo, {'user': user})
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
