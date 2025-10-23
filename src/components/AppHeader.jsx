import {StyleSheet, TouchableOpacity, Text, View, StatusBar} from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {useNavigation} from '@react-navigation/native'
import {useTheme} from '../context/ThemeContext'
import {SafeAreaView} from "react-native-safe-area-context";
import {lightTheme} from "../theme/theme";

const AppHeader = ({title, showBack, showSettings, openSettings, showNotification, openNotification}) => {
    const navigation = useNavigation();
    const {theme} = useTheme();

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.headerContainer}>
            <StatusBar barStyle={theme.mode === lightTheme ? "light-content" : "dark-content"}/>
            <View style={styles.leftHeader}>
                {showBack && <TouchableOpacity onPress={goBack}>
                    <Ionicons name="arrow-back" color={theme.text} size={24}/>
                </TouchableOpacity>}
                <Text style={[styles.title, {color: theme.text}]}>{title}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
                {showNotification && (
                    <TouchableOpacity onPress={openNotification}>
                        <Ionicons name="notifications-outline" size={24} color={theme.text}/>
                    </TouchableOpacity>
                )}
                {showSettings && (<TouchableOpacity onPress={openSettings}>
                    <Ionicons name="settings-outline" size={24} color={theme.text}/>
                </TouchableOpacity>)}
            </View>
        </SafeAreaView>
    )
}

export default AppHeader

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    leftHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 20
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
        marginVertical: 15,
    }
});