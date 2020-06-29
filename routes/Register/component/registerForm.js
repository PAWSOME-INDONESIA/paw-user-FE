import React, { Component } from "react";

import {TextInput, StyleSheet, Text, View, TouchableOpacity, StatusBar} from "react-native";

import Spinner from "../../Spinner/index";

import { AsyncStorage } from 'react-native';

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
        let data = {
            method: 'POST',
            credentials: 'same-origin',
            mode: 'same-origin',
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            }),
            headers: {
                'Accept':       'application/json',
                'Content-Type': 'application/json',
            }
        }
        let abc = fetch('https://demo1998209.mockable.io/clementBMG',{
            method: 'GET',
            // body: data
        })
            .then(response => response.json())  // promise
            .then(json => {
                if(json.code === 'SUCCESS'){
                    this.setState({
                        loading: false,
                        result: json.code
                    })

                    const _storeData = async () => {
                        try {
                            await AsyncStorage.setItem(
                                '@session',
                                'loggedIn!'
                            );
                        } catch (error) {
                            // Error saving data
                        }
                    };

                    this.props.onClick(_storeData());

                } else {
                    this.setState({
                        loading: true,
                        result: json.code
                    })
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
                                <Text style={styles.buttonText} onPress={(e) => this.onSubmit()}>Login</Text>
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
