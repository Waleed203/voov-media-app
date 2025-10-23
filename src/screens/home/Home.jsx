import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import Short from './components/Short';
import HomeHeader from './components/HomeHeader';
import Long from './components/Long';
import {useVideoContext} from '../../context/VideoContext';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import useGlobalFunctions from '../../services/GlobalService';
import {APP_CONSTANTS} from '../../config/constants';
import {useTheme} from '../../context/ThemeContext';
import Test from '../../components/Test';
import Feed from '../feed/Feed';

const Home = () => {
    const [activeTab, setActiveTab] = useState('Short');
    const isFocused = useIsFocused();
    const {setActiveIndex, setActiveVideoId} = useVideoContext();
    const {get} = useGlobalFunctions();
    const {theme, toggleTheme} = useTheme();

    useEffect(() => {
        console.log('is focussed value effect = ', isFocused);
        // setStoredTheme();
        if (!isFocused) {
            setActiveVideoId(null);
        }
    }, [isFocused]);

    // const setStoredTheme = async () => {
    //   console.log('inside set stored theme');
    //   const themeValue = await get(APP_CONSTANTS.STORAGE_KEYS.THEME, 'object');
    //   console.log('theme value in app = ', themeValue);
    //   toggleTheme(themeValue.mode);
    // }

    return (
        <View style={{flex: 1, backgroundColor: theme.background, position: 'relative'}}>
            <StatusBar backgroundColor="#000"/>
            <HomeHeader activeTab={activeTab} setActiveTab={setActiveTab}/>
            {activeTab == "Short" ? <Feed/> : <Long/>}
            {/* <VideoAd /> */}
        </View>
    );
};

export default Home;