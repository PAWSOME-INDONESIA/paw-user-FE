import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, Button} from 'react-native';

export default function IconCamera(props) {
    return (
            <TouchableOpacity onPress={props.onPress}>
                <Image source={ require('./download.png')} style={styles.img}/>
            </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    img: {
        flex: 1,
        position: 'relative',
        resizeMode: 'contain',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        height: 30,
        width: 30,
        left: 15,
    }
});
