import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const EmptyScreen = ({ message }) => {
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logo: {
        width: 150,
        height: 50,
    },
    text: {
        marginTop:40,
        fontSize: 18,
        color: '#555',
    },
});

export default EmptyScreen;
