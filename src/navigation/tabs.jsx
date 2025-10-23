import React, { useEffect, useState } from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {View, Text, StyleSheet} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Home from "../screens/home/Home";
import Watchlist from "../screens/watchlist/Watchlist";
import Search from "../screens/search/Search";
import Profile from "../screens/profile/Profile";
import {VideoProvider} from "../context/VideoContext";
import {useTheme} from "../context/ThemeContext";
import CameraRecorder from "../screens/camera-recorder/CameraRecorder";

const Tab = createBottomTabNavigator();

const HomeWithProvider = () => (
    <VideoProvider>
        <Home/>
    </VideoProvider>
);

const WatchlistWithProvider = () => (
    <VideoProvider>
        <Watchlist/>
    </VideoProvider>
);

const ProfileWithProvider = () => (
    <VideoProvider>
        <Profile/>
    </VideoProvider>
);

const TabNavigator = () => {
    const {theme} = useTheme();

    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.mode == 'dark' ? '#fff' : theme.text,
            tabBarStyle: [styles.tabBar, {backgroundColor: theme.mode == 'dark' ? '#1E1E1E' : theme.background}],
            headerShown: false,
        }}>
            <Tab.Screen name="Home" component={HomeWithProvider} options={{
                tabBarIcon: ({color, size, focused}) => (
                    <Ionicons name="home-outline" size={20} color={focused ? theme.primary : theme.text}/>
                ),
            }}/>
            <Tab.Screen
                name="Watchlist"
                component={WatchlistWithProvider}
                options={{
                    tabBarIcon: ({color, size, focused}) => (
                        <Ionicons name="bookmark-outline" size={20} color={focused ? theme.primary : theme.text}/>
                    ),
                }}
            />
            <Tab.Screen name="Add Video" component={CameraRecorder} options={{
                tabBarStyle: {display: 'none'},
                tabBarIcon: ({color, size, focused}) => (
                    <Ionicons name="add" size={20} color={focused ? theme.primary : theme.text}/>
                )
            }}/>
            <Tab.Screen name="Search" component={Search} options={{
                tabBarIcon: ({color, size, focused}) => (
                    <Ionicons name="search-outline" size={20} color={focused ? theme.primary : theme.text}/>
                ),
            }}/>
            <Tab.Screen
                name="Profile"
                component={ProfileWithProvider}
                options={{
                    tabBarIcon: ({color, size, focused}) => (
                        <Ionicons name="person-outline" size={20} color={focused ? theme.primary : theme.text}/>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        width: '90%',
        margin: '5%',
        bottom: 0,
        // left: '5%',
        // right: '5%',
        height: 60,
        paddingTop: 10,
        borderRadius: 50,
        backgroundColor: "#000",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        borderTopWidth: 0,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default TabNavigator;
