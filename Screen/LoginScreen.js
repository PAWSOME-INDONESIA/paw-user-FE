import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView, ImageBackground,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from './Components/Loader';
import {doLogin} from "../utils/API";

const LoginScreen = props => {
  let [loading, setLoading] = useState(false);
  let [isForget, setIsForget] = useState(false);
  let [userEmail, setUserEmail] = useState('');
  let [userPassword, setUserPassword] = useState('');
  let [errortext, setErrortext] = useState('');
  let [errorEmail, setErrorEmail] = useState('');
  let [errorPassword, setErrorPassword] = useState('');

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      setErrorEmail(true)
    }
    if (!userPassword || !userEmail) {
      setErrorPassword(true)
      return
    }
    setLoading(true);

    const param = JSON.stringify({
      "email": userEmail,
      "password": userPassword
    })

    doLogin(param).then(responseJson => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson, 'helo login');
        // If server response message same as Data Matched
        if (responseJson !== 'failed') {
          AsyncStorage.setItem('@session', responseJson.user.id);
          AsyncStorage.setItem('@user', responseJson.user.username);
          AsyncStorage.setItem('@userImage', responseJson.user.imageUrl);
          console.log(responseJson.user.id, 'login user ID');
          props.navigation.navigate('DrawerNavigationRoutes');
        } else {
          setErrortext('Please check your email id or password');
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <ImageBackground style={styles.mainBody} source={require('../assets/login_bg.png')}>
      <Loader loading={loading} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ marginTop: 50, justifyContent: 'center', alignItems: 'center', height: 650 }}>
          <KeyboardAvoidingView behavior="padding">
            <View style={{ alignItems: 'center', height: 400, width: 400, justifyContent: 'center'}}>
              <Image
                source={require('../assets/ggwp3.png')}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                }}
              />
            </View>
            <Text style={{fontWeight: '800', marginLeft: 35, color: '#908d8d', fontSize: 18, marginBottom: 15}}>
              Welcome!
            </Text>
            <View style={styles.SectionStyle}>
              <TextInput
                style={[styles.inputStyle, errorEmail && styles.errorBox]}
                onChangeText={UserEmail => {
                  setUserEmail(UserEmail)
                  setErrorEmail(false)
                }}
                underlineColorAndroid="transparent"
                placeholder="Email"
                placeholderTextColor="grey"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                // onSubmitEditing={() =>
                //   this.pass && this.pass.focus()
                // }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={[styles.inputStyle, errorPassword && styles.errorBox]}
                onChangeText={UserPassword => setUserPassword(UserPassword)}
                underlineColorAndroid="transparent"
                placeholder="Password"
                placeholderTextColor="grey"
                keyboardType="default"
                // ref={ref => this.pass = ref}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>Login</Text>
            </TouchableOpacity>
            <Text
              style={styles.forgotPassword}
              onPress={() => console.log('forgot pass')}>
              Forgot password?
            </Text>
            <Text
              style={styles.registerTextStyle2}
              onPress={() => props.navigation.navigate('RegisterScreen')}>
              Don't have an account?
              <Text style={styles.registerTextStyle}>
                {`  Sign Up`}
              </Text>
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center'
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 10,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    justifyContent: 'center',
    backgroundColor: '#FF5C2C',
    borderWidth: 0,
    height: 50,
    alignItems: 'center',
    borderRadius: 15,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "600"
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 15,
    height: 50,
    borderColor: 'white',
    backgroundColor: '#EDEEF1'
  },
  registerTextStyle: {
    color: '#FF5C2C',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 20
  },
  registerTextStyle2: {
    color: '#C9C9CB',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
    height: 100,
  },
  forgotPassword: {
    color: '#FF5C2C',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
  },
  errorBox: {
    borderColor: '#FF5C2C'
  }
});
