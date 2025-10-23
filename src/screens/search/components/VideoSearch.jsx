import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import VideoGrid from '../../profile/components/VideoGrid'
import { useNavigation } from '@react-navigation/native'
import useAPIService from '../../../services/APIService'

const VideoSearch = ({ data, pagination, keyword }) => {
  // console.log('video search', data)
  const navigation = useNavigation()
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { sendRequest } = useAPIService();
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState(pagination);

  useEffect(() => {
    console.log('videos = ', data);
    setVideos([])
    setVideos(data)
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
    console.log('searchQuery called')
    console.log('keyword = ', keyword, page, pagination);
    console.log('Page:', page, 'Total Pages:', pagination.total_pages, isLoadingMore);

    if (page > pagination.total_pages) return;

    setIsLoadingMore(true);

    const params = {
      keyword: keyword,
      page: page,
      limit: 10,
      type: 'video'
    };

    console.log('params = ', params);
    const res = await sendRequest('search', params, 'GET', false);
    const searchRes = res.data;

    console.log('searchRes = ', searchRes);
    if (searchRes.status) {
      const newVideos = searchRes.data.videos;
      setVideos((prev) => [...prev, ...newVideos]);

      setIsLoadingMore(false);
      setPage((prev) => prev + 1);
      setPaginationInfo({
        total_pages: searchRes.data.pagination.total_pages,
        total_results: searchRes.data.pagination.total_results
      });
    }

  };

  const openVideosList = (video, index) => {
    console.log('video = ', video, index);
    const userVideos = videos;
    navigation.navigate('FeedList', { video, index, userVideos, mode: 'search' })
  }

  return (
    <FlatList
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      data={videos}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.container1}
      renderItem={({ item, index }) => (
        <VideoGrid video={item} index={index} openVideo={openVideosList} mode="search" />
      )}

      // onEndReached={() => {
      //   console.log('End reached');
      //   searchQuery();
      // }}
      // onEndReachedThreshold={0.5}


      ListFooterComponent={() => {
        if (isLoadingMore) {
          return (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="small" color="white" />
            </View>
          );
        }

        if (videos?.length === 0) {
          return (
            <View style={{ height: 140, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <Text style={{ color: 'white' }}>No search results</Text>
            </View>
          );
        }

        return null;
      }}
    />
  )
}

export default VideoSearch

const styles = StyleSheet.create({
  container1: {
    padding: 5,
    paddingBottom: 140
  },
})