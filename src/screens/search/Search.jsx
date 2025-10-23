import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, useWindowDimensions, ActivityIndicator} from 'react-native';
import useAPIService from '../../services/APIService';
import Icon from 'react-native-vector-icons/Ionicons'
import AppHeader from '../../components/AppHeader';
import VideoGrid from '../profile/components/VideoGrid';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import {TabBar, TabView} from 'react-native-tab-view'
import VideoSearch from './components/VideoSearch';
import UserSearch from './components/UserSearch';

const routes = [
    {key: 'videos', title: 'Videos'},
    {key: 'users', title: 'Users'},
];

const Search = () => {
    const layout = useWindowDimensions();
    const [searchText, setSearchText] = useState("");
    const {sendRequest} = useAPIService();
    const navigation = useNavigation();
    const [searchResults, setSearchResults] = useState(null);
    const inputRef = useRef(null);
    const inputValueRef = useRef('');
    const {theme} = useTheme();
    const [searching, setSearching] = useState(false);
    const [index, setIndex] = useState(0);

    const renderScene = ({route}) => {
        switch (route.key) {
            case 'videos':
                return <VideoSearch data={searchResults?.videos} pagination={searchResults?.video_pagination} keyword={searchResults?.keyword} isActive={index === 0}/>;
            case 'users':
                return <UserSearch data={searchResults?.users} pagination={searchResults?.user_pagination} keyword={searchResults?.keyword} isActive={index === 1}/>;
            default:
                return null;
        }
    };

    // useFocusEffect(
    //   useCallback(() => {
    //     const timer = setTimeout(() => {
    //       if (inputRef.current) {
    //         inputRef.current.focus();
    //       }
    //     }, 300);

    //     return () => clearTimeout(timer);
    //   }, [])
    // );

    const searchQuery = async () => {
        if (!searchText || !searchText.trim()) return;
        setSearching(true)
        const params = {keyword: searchText, page: 1, limit: 10, type: null};
        console.log('params = ', params);
        const res = await sendRequest('search', params, 'GET', false);
        console.log('res search = ', res.data);
        const searchRes = res.data;
        if (searchRes.status) setSearchResults(searchRes.data);
        setSearching(false)
    }
    const handleTextChange = (text) => {
        if (!text) setSearchResults(null);
        setSearchText(text)
    }
    return (
        <View style={[styles.maincontainer, {backgroundColor: theme.background}]}>
            <AppHeader title={"Search"}/>

            <Text style={[styles.subtitle, {color: theme.text}]}>What would you like to watch today?</Text>

            <View style={[styles.searchContainer, {
                backgroundColor: theme.mode === "dark" ? "#1E1E1E" : theme.background,
                borderColor: theme.mode === "dark" ? "transparent" : theme.borderColor,
                borderWidth: theme.mode === "dark" ? 0 : 0.4,
            }]}>
                <Icon name="search-outline" size={20} color={theme.text} style={styles.icon}/>
                <TextInput
                    ref={inputRef}
                    style={[styles.input, {color: theme.text}]}
                    value={searchText}
                    placeholder="Search TV Shows, Movies & Videos"
                    placeholderTextColor={theme.text}
                    onChangeText={(text) => handleTextChange(text)}
                    onSubmitEditing={searchQuery}
                />
            </View>

            {/* <View style={styles.searchButtonContainer}>
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: theme.primary }]}
          onPress={searchQuery}
        >
          <Text
            style={[
              styles.searchButtonText,
              {
                color:
                  theme.mode === "dark" ? "#fff" : theme.background,
              },
            ]}
          >
            Search
          </Text>
        </TouchableOpacity>

      </View> */}

            <TabView
                animationEnabled
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{width: layout.width}}
                renderTabBar={(props) => (
                    <TabBar {...props} scrollEnabled={true}
                            style={{backgroundColor: "transparent", elevation: 0, shadowOpacity: 0}}
                            indicatorStyle={{backgroundColor: theme.primary}}
                            activeColor={theme.primary}
                            inactiveColor={theme.text}
                            tabStyle={{width: 'auto', paddingHorizontal: 6}}
                    />)}
            />

            {
                searching ? (
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color="white"/>
                    </View>
                ) : null
            }

        </View>
    );
};

const styles = StyleSheet.create({
    tabView: {
        backgroundColor: 'transparent'
    },
    maincontainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#000',
    },
    container: {
        padding: 10,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 10,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#333",
        borderRadius: 8,
        padding: 5,
        paddingStart: 10,
        marginHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: "white",
        fontSize: 14,
    },
    searchButtonContainer: {
        alignItems: 'center',
    },
    searchButton: {
        width: '30%',
        backgroundColor: "#333",
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 20,
    },
    searchButtonText: {
        letterSpacing: 0.5,
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default Search; 