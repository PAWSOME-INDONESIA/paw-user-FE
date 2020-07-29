import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView, ImageBackground,
} from 'react-native';
import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter';
import Loader from './Components/Loader';
import { doRegister, checkUsernameUnique, checkEmailUnique } from "../utils/API";

const RegisterScreen = props => {
  let [userName, setUserName] = useState('');
  let [userEmail, setUserEmail] = useState('');
  let [userPassword, setUserPassword] = useState('');
  let [confirmPassword, setConfirmPassword] = useState('');
  let [loading, setLoading] = useState(false);
  let [checkUsername, setCheckUsername] = useState(false);
  let [checkEmail, setCheckEmail] = useState(false);
  let [checkPassword, setCheckPassword] = useState(false);
  let [uniqueEmail, setUniqueEmail] = useState(false);
  let [errortext, setErrortext] = useState('');
  let [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const handleSubmitButton = () => {
    setErrortext('');
    if (!userName) {
      alert('Please fill Name');
      return;
    }
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    if (!confirmPassword) {
      alert('Please fill Password again');
      return;
    }
    //Show Loader
    setLoading(true);

    const param = JSON.stringify({
      "email": userEmail,
      "password": userPassword,
      "username": userName
    })

    doRegister(param)
      .then(responseJson => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson !== 'failed') {
          setIsRegistraionSuccess(true);
          console.log('Registration Successful. Please Login to proceed');
        } else {
          setErrortext('Registration Unsuccessful');
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };
  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../assets/dog.png')}
          style={{ height: 150, resizeMode: 'contain', alignSelf: 'center' }}
        />
        <Text style={styles.successTextStyle}>Registration Successful.</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <ImageBackground style={{ flex: 1, justifyContent: 'center' }} source={require('../assets/login_bg.png')}>
      <Loader loading={loading} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginTop: 80 }}>
          <Image
            source={require('../assets/ggwp3.png')}
            style={{
              width: 150,
              height: 150,
              resizeMode: 'contain',
              margin: 30,
              borderRadius: 100
            }}
          />
        </View>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.SectionStyle}>
            <TextInput
              style={[styles.inputStyle, checkUsername && styles.textValid]}
              onChangeText={UserName => {
                if(UserName.length <= 2){
                  setCheckUsername(true)
                }
                if(UserName.length > 2){
                  checkUsernameUnique(UserName).then(res => {
                    console.log(res, 'helo res')
                    if(res === 'success'){
                      setCheckUsername(true)
                    } else if(res === 'failed'){
                      setCheckUsername(false)
                    }
                  })
                }
                setUserName(UserName)
              }}
              underlineColorAndroid="transparent"
              placeholder="Username"
              placeholderTextColor="grey"
              returnKeyType="next"
              autoCapitalize="none"
              // onSubmitEditing={() =>
              //   this.emailInput && this.emailInput.focus()
              // }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={[styles.inputStyle, checkEmail && styles.textValid]}
              onChangeText={UserEmail => {
                let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (reg.test(UserEmail) === false) {
                  setCheckEmail(true)
                }
                else {
                  setCheckEmail(false)
                  checkEmailUnique(UserEmail).then(res => {
                    console.log(res, 'helo res')
                    if(res === 'success'){
                      setUniqueEmail(true)
                    } else if(res === 'failed'){
                      setUniqueEmail(false)
                    }
                  })
                }
                setUserEmail(UserEmail)
              }}
              underlineColorAndroid="transparent"
              placeholder="Email"
              placeholderTextColor="grey"
              keyboardType="email-address"
              // ref={ref => {
              //   this.emailInput = ref;
              // }}
              returnKeyType="next"
              autoCapitalize="none"
              // onSubmitEditing={() => this.passwordInput && this.passwordInput.focus()}
              blurOnSubmit={false}
            />
          </View>
          {uniqueEmail && (
            <Text style={{color: 'red', marginLeft: 23, marginTop: 5}}>That email address already in use. Please use a different email address</Text>
          )}
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={password => setUserPassword(password)}
              underlineColorAndroid="transparent"
              placeholder="Password"
              placeholderTextColor="grey"
              secureTextEntry={true}
              textContentType={'oneTimeCode'}
              // ref={ref => {
              //   this.passwordInput = ref;
              // }}
              // onSubmitEditing={() =>
              //   this.confirmPassword && this.confirmPassword.focus()
              // }
              blurOnSubmit={false}
            />
          </View>
          {userPassword.length > 0 &&
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <BarPasswordStrengthDisplay
              password={userPassword}
              width={320}
              minLength={0}
            />
          </View>
          }
          <View style={styles.SectionStyle}>
            <TextInput
              style={[styles.inputStyle, checkPassword && styles.textValid]}
              onChangeText={cpass => {
                if(userPassword !== cpass){
                  setCheckPassword(true)
                } else {
                  setCheckPassword(false)
                }
                setConfirmPassword(cpass)
              }}
              underlineColorAndroid="transparent"
              placeholder="Confirm Password"
              placeholderTextColor="grey"
              secureTextEntry={true}
              // ref={ref => {
              //   this.confirmPassword = ref;
              // }}
              returnKeyType="next"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>
          {errortext != '' ? (
            <Text style={styles.errorTextStyle}> {errortext} </Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}>
            <Text style={styles.buttonTextStyle}>Sign Up</Text>
          </TouchableOpacity>
          <Text
            style={styles.registerTextStyle2}
            onPress={() => props.navigation.navigate('LoginScreen')}>
            Already have an account?
            <Text style={styles.registerTextStyle}>
              {`  Sign In`}
            </Text>
          </Text>
        </KeyboardAvoidingView>
      </ScrollView>
    </ImageBackground>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  registerTextStyle: {
    color: '#FF5C2C',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  registerTextStyle2: {
    color: '#C9C9CB',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
    height: 100,
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
  textValid: {
    borderColor: 'red',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 30,
  },
});
