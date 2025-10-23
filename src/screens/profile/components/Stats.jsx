import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAPIService from '../../../services/APIService';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const Stats = ({handleStats}) => {
  const { sendRequest } = useAPIService();
  const [stats, setStats] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    fetchMyFollowing();
  }, [])

  const fetchMyFollowing = async () => {
    try {
      const params = {};
      const response = await sendRequest('follow_following_list', params, 'POST', true);
      const followingRes = response.data;
      console.log('following Res = ', followingRes);
      if (followingRes.status) {
        setStats(followingRes.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  return (
    <View style={styles.statsContainer}>
      <TouchableOpacity style={styles.statItem} onPress={() => handleStats('following')}>
        <Text style={[styles.statNumber, { color: theme.text }]}>{stats?.following_list?.length}</Text>
        <Text style={[styles.statLabel, { color: theme.text }]}>Following</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.statItem} onPress={() => handleStats('followers')}>
        <Text style={[styles.statNumber, { color: theme.text }]}>{stats?.follow_by_list?.length}</Text>
        <Text style={[styles.statLabel, { color: theme.text }]}>Followers</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Stats

const styles = StyleSheet.create({

  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  statItem: {
    alignItems: "center",
    marginHorizontal: 40,
  },
  statNumber: {
    color: "#fff",
    fontSize: 16,
  },
  statLabel: {
    color: "#eee",
    fontSize: 12,
  },
})