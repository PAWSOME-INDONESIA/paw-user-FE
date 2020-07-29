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
import {doLogin, getForgetPassword} from "../utils/API";
import isEmpty from "react-native-web/dist/vendor/react-native/isEmpty";

const LoginScreen = props => {
  let [loading, setLoading] = useState(false);
  let [isForget, setIsForget] = useState(false);
  let [userEmail, setUserEmail] = useState('');
  let [userEmailForget, setUserEmailForget] = useState('');
  let [userPassword, setUserPassword] = useState('');
  let [errorText, setErrortext] = useState('');
  let [errorEmail, setErrorEmail] = useState('');
  let [errorEmailText, setErrorEmailText] = useState('');
  let [errorEmailForget, setErrorEmailForget] = useState('');
  let [errorPassword, setErrorPassword] = useState('');

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      setErrorEmail(true)
      setErrorEmailText('Input a valid email address')
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
        if (responseJson.user) {
          AsyncStorage.setItem('@session', responseJson.user.id);
          AsyncStorage.setItem('@user', responseJson.user.username);
          AsyncStorage.setItem('@userImage', responseJson.user.iconUrl);
          AsyncStorage.setItem('@userEmail', responseJson.user.email);
          console.log(responseJson.user.id, 'login user ID');
          props.navigation.navigate('DrawerNavigationRoutes');
        } else {
          if(responseJson === 'EMAIL_NOT_YET_VERIFIED'){
            setErrortext('Please verify your Email Address');
          } else {
            setErrortext('Incorrect Email Address or Password');
          }
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  const handleSubmitForget = () => {
    if(isEmpty(userEmailForget)){
      setErrorEmailForget(true)
    }
    getForgetPassword(userEmailForget).then(res => {
      console.log(res, 'helo res')
      if(res === 'success'){
        setIsForget(false)
        setUserEmailForget('')
      }
    })
  }

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
            {isForget && (<React.Fragment>
              <Text style={{fontWeight: '800', marginLeft: 35, color: '#908d8d', fontSize: 18, marginBottom: 15}}>
                Forgot Password?
              </Text>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={[styles.inputStyle, errorEmailForget && styles.errorBox]}
                  onChangeText={eForget => {
                    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    if (reg.test(eForget) === false) {
                      setErrorEmailForget(true)
                    } else {
                      setErrorEmailForget(false)
                    }
                    setUserEmailForget(eForget)
                  }}
                  underlineColorAndroid="transparent"
                  placeholder="Email"
                  placeholderTextColor="grey"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <Text style={styles.errorTextStyle}>{errorEmailForget && 'Email is not valid'}</Text>
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitForget}>
                <Text style={styles.buttonTextStyle}>Submit</Text>
              </TouchableOpacity>
              <Text
                style={styles.forgotPassword}
                onPress={() => {
                  setIsForget(false)
                  setUserEmailForget('')
                  setUserEmail('')
                  setUserPassword('')
                  setErrorEmail(false)
                  setErrorPassword(false)
                  setErrorEmailForget(false)
                }}>
                Back to Login Page
              </Text>
            </React.Fragment>)}
            {!isForget && (
              <React.Fragment>
                <Text style={{fontWeight: '800', marginLeft: 35, color: '#908d8d', fontSize: 18, marginBottom: 15}}>
                  Welcome!
                </Text>
                <View style={styles.SectionStyle}>
                  <TextInput
                    style={[styles.inputStyle, errorEmail && styles.errorBox]}
                    onChangeText={UserEmail => {
                      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                      if (reg.test(UserEmail) === false) {
                        setErrorEmail(true)
                        setErrorEmailText('Input a valid Email Address')
                      } else {
                        setErrorEmail(false)
                        setErrorEmailText('')
                      }
                      setUserEmail(UserEmail)
                    }}
                    underlineColorAndroid="transparent"
                    placeholder="Email"
                    placeholderTextColor="grey"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      this.pass && this.pass.focus()
                    }
                    blurOnSubmit={false}
                  />
                </View>
                {errorEmailText !== '' ? (
                  <Text style={styles.errorTextStyle}>{errorEmailText && errorEmailText}</Text>
                ) : null}
                <View style={styles.SectionStyle}>
                  <TextInput
                    style={[styles.inputStyle, errorPassword && styles.errorBox]}
                    onChangeText={UserPassword => setUserPassword(UserPassword)}
                    underlineColorAndroid="transparent"
                    placeholder="Password"
                    placeholderTextColor="grey"
                    keyboardType="default"
                    ref={ref => this.pass = ref}
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={false}
                    secureTextEntry={true}
                  />
                </View>
                {errorText != '' ? (
                  <Text style={styles.errorTextStyle}>{errorText}</Text>
                ) : null}
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={handleSubmitPress}>
                  <Text style={styles.buttonTextStyle}>Login</Text>
                </TouchableOpacity>
                <Text
                  style={styles.forgotPassword}
                  onPress={() => setIsForget(true)}>
                  Forgot password?
                </Text>
                <Text
                  style={styles.registerTextStyle2}
                  onPress={() => {
                    setUserPassword('')
                    setUserEmail('')
                    setErrorPassword(false)
                    setErrorEmailText('')
                    setErrorEmail(false)
                    props.navigation.navigate('RegisterScreen')}
                  }>
                  Don't have an account?
                  <Text style={styles.registerTextStyle}>
                    {`  Sign Up`}
                  </Text>
                </Text>
              </React.Fragment>
            )}
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
    width: 180,
    left: 110
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
