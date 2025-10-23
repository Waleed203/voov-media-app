import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import UserStatsItem from '../../user-stats/components/UserStatsItem'
import { useNavigation } from '@react-navigation/native'
import { FlatList } from 'react-native-gesture-handler'
import useAPIService from '../../../services/APIService'

const UserSearch = ({ data, pagination, keyword }) => {
  console.log('user search', data)
  const navigation = useNavigation()
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { sendRequest } = useAPIService();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState(pagination);

  useEffect(()=>{
    console.log('users = ', data);
    setUsers([])
    setUsers(data)
  }, [data])

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await searchQuery();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const searchQuery = async () => {
    if (page > paginationInfo.total_pages) return;

    const params = {
      keyword: inputValueRef.current,
      page: page,
      limit: 10,
      type: 'user'
    };

    const res = await sendRequest('search', params, 'GET', false);
    const searchRes = res.data;

    if (searchRes.status) {
      const newUsers = searchRes.data.users;

      setUsers((prev) => [...prev, ...newUsers]);

      setPage((prev) => prev + 1);
      setPaginationInfo({
        total_pages: searchRes.data.pagination.total_pages,
        total_results: searchRes.data.pagination.total_results
      });
    }
  };

  return (
    <FlatList
      data={users}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      keyExtractor={(item, index) => index}
      contentContainerStyle={styles.container1}
      renderItem={({ item, index }) => (
        <UserStatsItem data={item} index={index} mode='search' />
      )}
      ListFooterComponent={() => {
        return (
          <>
            {
              users?.length == 0 ? (
                <View style={{ height: 140, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  <Text style={{ color: 'white' }}>No search results</Text>
                </View>
              ) : null
            }
          </>
        );
      }}
    />
  )
}

export default UserSearch

const styles = StyleSheet.create({
  container1: {
    padding: 5,
    paddingBottom: 140
  },
})