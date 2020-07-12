import React, { Component } from "react";

import {TextInput, StyleSheet, Text, View, TouchableOpacity, StatusBar} from "react-native";

import Spinner from "../../Spinner/index";

import {doRegister} from "../../../utils/API";
import isEmpty from "react-native-web/dist/vendor/react-native/isEmpty";

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            email: '',
            password: '',
            context: null,
            loading: false,
            result: ''
        }
        this.onChangeText = this.onChangeText.bind(this)
    }
    onChangeText(text, type){
        if(type === 'email'){
            this.setState({email: text})
        }
        if(type === 'password'){
            this.setState({password: text})
        }
    }
    onSubmit(){
        this.setState({
            loading: true
        })


      const param = JSON.stringify({
        "email": this.state.email, //"jo@test.com"
        "password": this.state.password //12345
      })

      doRegister(param).then(res => {
        this.setState({
          loading: false,
        })

        if(!isEmpty(res)){
          this.setState({
            result: res
          })
          this.props.onClick()
        } else {
          alert('Please try again')
        }
      })
    }

    render() {
        return (
            <View style={styles.container}>
                {/*status bar -> phone clock bar status up*/}
                <StatusBar
                    barStyle="light-content"
                />
                {
                    this.state.loading ? (
                        <Spinner/>
                    ) : (
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder="User Name"
                                returnKeyType="next"
                                onSubmitEditing={() => this.emailAddress.focus()}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholderTextColor="rgba(255,255,255,255)"
                                onChange={text => this.onChangeText(text.nativeEvent.text, 'userName')}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                returnKeyType="next"
                                onSubmitEditing={() => this.passwordInput.focus()}
                                ref={(input) => this.emailAddress = input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholderTextColor="rgba(255,255,255,255)"
                                onChange={text => this.onChangeText(text.nativeEvent.text, 'email')}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                secureTextEntry
                                returnKeyType="next"
                                onSubmitEditing={() => this.passwordConfirmInput.focus()}
                                ref={(input) => this.passwordInput = input}
                                placeholderTextColor="rgba(255,255,255,255)"
                                onChange={text => this.onChangeText(text.nativeEvent.text, 'password')}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                secureTextEntry
                                returnKeyType="go"
                                ref={(input) => this.passwordConfirmInput = input}
                                placeholderTextColor="rgba(255,255,255,255)"
                                onChange={text => this.onChangeText(text.nativeEvent.text, 'passwordConfirm')}
                            />
                            <TouchableOpacity style={styles.buttonContainer}>
                                <Text style={styles.buttonText} onPress={(e) => this.onSubmit()}>Sign Up</Text>
                            </TouchableOpacity>
                            <Text style={styles.signUpText} onPress={(e) => this.props.navi.navigate('Login')}>Already Have an account? Log In</Text>
                        </View>
                    )
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 20,
        paddingHorizontal: 10,
        color: '#fff',
        borderRadius: 50,
        bottom: 50
    },
    buttonContainer: {
        backgroundColor: '#d2772e',
        paddingVertical: 15,
        borderRadius: 50,
        bottom: 50
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
    },
    signUpText: {
        textAlign: 'center',
        color: '#fff',
        bottom: 40
    }
})
