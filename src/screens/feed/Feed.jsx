import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Item from './components/Item';
import { FlashList } from '@shopify/flash-list';
import { debounce } from 'lodash';
import { useFocusEffect } from '@react-navigation/native';

const Feed = () => {
  console.log('feed remounted');
    const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreVideos = debounce(() => {
    setPage(prevPage => {
      const nextPage = prevPage + 1;
      console.log('load more videos', nextPage);
      fetchVideos('shorts', nextPage);
      return nextPage;
    });
  }, 500);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
    minimumViewTime: 200,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      // const firstViewable = viewableItems[0];
      // if (firstViewable?.index !== currentViewableItemIndex) {
      setCurrentViewableItemIndex(viewableItems[0].index);
      // }
    }
  }).current;

  const fetchVideos = async (type, pageNum) => {
    console.log('fetching videos', type, pageNum);
    if (loading) return;

    setLoading(true);

    const uid = null;
    const params = new URLSearchParams({
      video_type: 'shorts',
      user_id: uid,
      page: pageNum,
    });

    try {
      const response = await fetch(`https://app.voovmedia.com/api/uploaded_videos_list?page=${pageNum}&video_type=${type}`);
      const data = await response.json();
      console.log('response = ', data);

      if (data.status) {
        if (videos == null) {
          setVideos([]);
        }
        const newVideos = data.data.user_videos || [];
        // console.log('videos = ', newVideos);
        setVideos((prev) => [...prev, ...newVideos]);
        setPage(pageNum);
      }
    } catch (err) {
      console.error('Fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('videos = ', videos);
    const preloadThumbnails = () => {
      videos.forEach((video) => {
        Image.prefetch(video.video_thumbnail);
      });
      console.log('Started thumbnail preloading');
    };
  
    if (videos.length) {
      preloadThumbnails();
    }
  }, [videos]);
  

  useFocusEffect(
    useCallback(() => {
      console.log('Feed focused');

      return () => {
        console.log('Feed unfocused');
        setCurrentViewableItemIndex(null)
      };
    }, [])
  );

	const handleRefresh = async () => {
		try {
      setVideos([]);
			setIsRefreshing(true);
			await fetchVideos('shorts', 1);
		} catch (err) {
			console.error(err);
		} finally {
			setIsRefreshing(false);
		}
	};

  return (
    <View style={styles.container}>
      <FlashList
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        data={videos}
        extraData={currentViewableItemIndex}
        estimatedItemSize={Dimensions.get('window').height}
        renderItem={({ item, index }) => <Item item={item} index={index} shouldPlay={index === currentViewableItemIndex} updateCurrentIndex={setCurrentViewableItemIndex} mode='feed' />}
        onEndReached={loadMoreVideos}
        currentViewableItemIndex={currentViewableItemIndex}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ backgroundColor: 'black' }}
        onViewableItemsChanged={onViewableItemsChanged}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

export default Feed

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})