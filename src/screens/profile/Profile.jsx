import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, StatusBar } from 'react-native';
import AppHeader from '../../components/AppHeader';
import UserInfo from './components/UserInfo';
import UserVideos from './components/UserVideos';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useVideoContext, VideoProvider } from '../../context/VideoContext';
import { useTheme } from '../../context/ThemeContext';

const Profile = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshKey(prev => prev + 1);
    setRefreshing(false);
  };

  const gotoSettings = () => {
    navigation.navigate('Settings');
  }

  const gotoNotification = () => {
    navigation.navigate('Notifications');
  }

  useFocusEffect(
    useCallback(() => {
      console.log('in profile');
    }, []),
  )

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar backgroundColor={theme.mode === 'light' ? '#fff' : '#121221'} barStyle={theme.mode === 'light' ? 'dark-content' : 'light-content'} />
      <FlatList contentContainerStyle={{ backgroundColor: theme.background, paddingBottom: 150 }}
                ListHeaderComponent={() => {
        return (
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <AppHeader title="Profile" showSettings={true} openSettings={gotoSettings} showNotification={true} openNotification={gotoNotification} />
            <UserInfo />
            <UserVideos key={refreshKey} mode="user" />
          </View>
        );
      }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
});

export default Profile; 