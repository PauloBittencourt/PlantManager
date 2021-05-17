import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import colors from '../pages/colors';
import bittencourt from '../assets/bittencourt.jpg';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import fonts from '../styles/fonts';

export function Header() {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.greeing}>Olá, </Text>
                <Text style={styles.userName}>Paulo </Text>
            </View>

            <Image source={bittencourt} style={styles.image} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: getStatusBarHeight(),

    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 40
    },
    greeing: {
        fontSize: 32,
        color: colors.heading,
        fontFamily: fonts.text
    },
    userName: {
        fontSize: 32,
        fontFamily: fonts.heading,
        lineHeight: 40
    }
});