import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import Item from '../feed/components/Item';

const FeedList = (props) => {
  const { video, index, userVideos, mode } = props.route.params;
  console.log('feed list', { video, index, userVideos, mode });

  const [videos, setVideos] = useState(userVideos);

  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(index);
  const [loading, setLoading] = useState(false);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
    minimumViewTime: 200,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      console.log('viewable = ', viewableItems[0]);
      setCurrentViewableItemIndex(viewableItems[0].index);
    }
  }).current;

  useEffect(() => {
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
      console.log('Feed list focused');

      return () => {
        setTimeout(() => {
          setCurrentViewableItemIndex(null)
        }, 100);
        console.log('Feed unfocused');
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={videos}
        extraData={currentViewableItemIndex}
        estimatedItemSize={Dimensions.get('window').height}
        renderItem={({ item, index }) => <Item item={item} index={index} shouldPlay={index === currentViewableItemIndex} updateCurrentIndex={setCurrentViewableItemIndex} mode='user' />}
        currentViewableItemIndex={currentViewableItemIndex}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ backgroundColor: 'black' }}
        onViewableItemsChanged={onViewableItemsChanged}
        initialScrollIndex={mode != 'feed' ? index : null}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

export default FeedList

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})