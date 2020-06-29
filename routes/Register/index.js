import React, { Component } from 'react';
import {Image, KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";
import RegisterForm from "./component/registerForm";
import {getToken} from "../../utils/store";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: null,
        }
    }

    componentDidMount() {
        getToken()
            .then(value => {
                this.setState({ "authenticated": value });
            })
    }

    render() {
        return(
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/ggwp.png')}
                        style={styles.logo}
                    />
                    {/*<Text style={styles.title}>App designed to help pet lovers</Text>*/}
                </View>
                <RegisterForm onClick={() => this.props.navigation.navigate("Login")} navi={this.props.navigation}/>
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
        width: 150,
        height: 150
    },
    title: {
        color: '#ffffff',
        marginTop: 10
    }
})
