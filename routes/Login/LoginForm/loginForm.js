import React, { Component } from "react";
import {TextInput, StyleSheet, Text, View, TouchableOpacity, StatusBar} from "react-native";
import Spinner from "../../Spinner/index";
import {login} from "../../../utils/API";
import isEmpty from "react-native-web/dist/vendor/react-native/isEmpty";
import {storeToken} from "../../../utils/store";

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            email: '',
            password: '',
            context: null,
            loading: false,
            error: false
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
    async onSubmit() {
        this.setState({
            loading: true
        })

        const param = JSON.stringify({
            "email": this.state.email, //"jo@test.com"
            "password": this.state.password //12345
        })

        login(param).then(res => {
            if(!isEmpty(res)){
                this.setState({
                  loading: false,
                  error: false
                })

              storeToken(res.user.id)
                this.props.onClick({
                  goTo: "Home",
                  user: res
                });
            } else {
                this.setState({
                    loading: false,
                    error: true,
                    result: []
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
                            {
                                this.state.error ? (
                                    <Text style={styles.error}>email or password doesn't match</Text>
                                ) : null
                            }
                            <TextInput
                                style={styles.input}
                                value={this.state.email}
                                placeholder="Username or Email"
                                returnKeyType="next"
                                onSubmitEditing={() => this.passwordInput.focus()}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholderTextColor="rgba(255,255,255,255)"
                                onChange={text => this.onChangeText(text.nativeEvent.text, 'email')}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={this.state.password}
                                secureTextEntry
                                returnKeyType="go"
                                ref={(input) => this.passwordInput = input}
                                placeholderTextColor="rgba(255,255,255,255)"
                                onChange={text => this.onChangeText(text.nativeEvent.text, 'password')}
                            />
                            <TouchableOpacity style={styles.buttonContainer}>
                                <Text style={styles.buttonText} onPress={(e) => this.onSubmit()}>Login</Text>
                            </TouchableOpacity>
                            <Text style={styles.signUpText} onPress={(e) => this.props.navi.navigate('Register')}>Doesn't Have an account yet? Sign Up</Text>
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
    error: {
        height: 40,
        marginBottom: 20,
        paddingHorizontal: 10,
        color: 'rgba(255,0,0,0.55)',
        borderRadius: 50,
        bottom: 25,
        textAlign: 'center'
    },
    signUpText: {
        textAlign: 'center',
        color: '#fff',
        bottom: 40
    }
})
