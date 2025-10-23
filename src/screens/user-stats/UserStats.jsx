import { ActivityIndicator, FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TabBar, TabView } from 'react-native-tab-view'
import UserStatsItem from './components/UserStatsItem';
import useAPIService from '../../services/APIService';
import AppHeader from '../../components/AppHeader';
import { useTheme } from '../../context/ThemeContext';
import { useRoute } from '@react-navigation/native';

const UserStats = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState({});
  const {sendRequest} = useAPIService();
  const {data, type} = useRoute().params;
  const { theme } = useTheme();

  console.log('data on user stats = ', data);
  console.log('type = ', type);

  useEffect(() => {
    console.log('inside user stats', data);
    // fetchMyFollowing();
  }, [])

  // const fetchMyFollowing = async () => {
  //   try {
  //     const params = {};
  //     const response = await sendRequest('follow_following_list', params, 'POST', true);
  //     const followingRes = response.data;
  //     console.log('following Res = ', followingRes);
  //     if (followingRes.status) {
  //       setStats(followingRes.data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching profile:', error);
  //   }
  // }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <AppHeader title={type == 'following' ? "Following" : "Followers"} showBack={true} />
      <FlatList
        data={data}
        renderItem={({ item, index }) => <UserStatsItem data={item} index={index} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
}

export default UserStats

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  tabView: {
    backgroundColor: '#fff'
  }
})