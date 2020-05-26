import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const Spinner = () =>  {
        return(
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        bottom: 200
    }
});

export default Spinner;
