import React, { Component } from 'react';
import {Image, KeyboardAvoidingView, StyleSheet, Text, View, AsyncStorage} from "react-native";
import LoginForm from "./component/loginForm";

export const isSignedIn = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('@session')
            .then(res => {
                if (res !== null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(err => reject(err));
    });
};

// const token = await isSignedIn();

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: null,
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("@session")
            .then(value => {
                this.setState({ "authenticated": value });
            })
    }

    render() {
        // this.props.navigation.navigate("Home");
        if(this.state.authenticated){
            this.props.navigation.navigate("Home")
        } else {
            this.props.navigation.navigate("Login")
        }
        return(
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/ggwp.png')}
                        style={styles.logo}
                    />
                    {/*<Text style={styles.title}>Woof...</Text>*/}
                </View>
                <LoginForm
                    onClick={(res) => {
                        const goTo = res.goTo;
                        const user = res.user
                        this.props.navigation.navigate(goTo, {'user': user})}
                    }
                    navi={this.props.navigation}/>
            </KeyboardAvoidingView>
        )
    }
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
