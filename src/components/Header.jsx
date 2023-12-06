import { StyleSheet, View, Image, Text, Animated, ScrollView } from 'react-native'
import { COLORS } from '../utils/colors'
import React, { useRef, useState } from 'react';


export default function Header() {
    
    return (
        <View style={styles.headerContainer}>
            <Image source={require('../../assets/logo.png')} style={styles.logo_img} />
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: 70,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.1,
        elevation: 10,
    },

    logo_img: {
        width: 160,
        height: 100,
        resizeMode: 'contain',
        marginLeft: 10,
        marginTop: 3,
    }
})