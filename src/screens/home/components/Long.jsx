import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, Dimensions, ActivityIndicator, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useAPIService from '../../../services/APIService';
import VideoCard from '../../../components/VideoCard';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { ViewToken } from "react-native";
import { useVideoContext } from '../../../context/VideoContext';
import { useTheme } from '../../../context/ThemeContext';

const { height } = Dimensions.get('window');
const Long = () => {
  console.log('long reloaded')
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { sendRequest } = useAPIService();
  const { setActiveIndex, setActiveVideoId } = useVideoContext();
  const { theme } = useTheme()

  const flatListRef = useRef(null);

  useEffect(() => {
    fetchVideos('long', 1);
  }, []);

  const fetchVideos = async (type, pageNum) => {
    if (loading) return;
    setLoading(true);

    const uid = null;
    const params = { video_type: type, user_id: uid, page: pageNum };
    const response = await sendRequest('uploaded_videos_list', params, 'GET', false);

    if (response.status) {
      const newVideos = response.data.data.user_videos || [];
      console.log('videos = ', response.data.data.user_videos);
      setVideos((prev) => [...prev, ...newVideos]);
      setPage(pageNum);
    }

    setLoading(false);
  };

  const loadMoreVideos = () => {
    console.log('load more videos', page);
    if (!loading) {
      fetchVideos('long', page + 1);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  const onViewableItemsChanged = ({ viewableItems }) => {
    console.log('viewableItems', viewableItems);

    if (viewableItems.length > 0) {
      const currentVideo = viewableItems[0];
      console.log("Switched to video:", currentVideo);
      setActiveIndex(currentVideo.index);
      setActiveVideoId(currentVideo.item.id);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ backgroundColor: theme.background, flex: 1 }}>
        {
          videos.length == 0 ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
              <Text style={{ color: theme.text, fontSize: 20 }}>No long videos available</Text>
            </View>
            :
            <FlashList
              ref={flatListRef}
              data={videos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (<VideoCard item={item} index={index} />)}
              onViewableItemsChanged={onViewableItemsChanged}
              estimatedItemSize={height}
              contentContainerStyle={{ width: "100%", backgroundColor: theme.background }}
              pagingEnabled
              showsVerticalScrollIndicator={false}
              snapToAlignment="start"
              decelerationRate="normal"
              snapToInterval={height}
              onEndReached={loadMoreVideos}
              onEndReachedThreshold={0.5}
              viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
              ListFooterComponent={
                loading ? (
                  <View style={{ marginVertical: 20 }}>
                    <ActivityIndicator size="large" color="white" />
                  </View>
                ) : null
              }
            />
        }
      </View>
    </GestureHandlerRootView>
  );
};

export default Long; 