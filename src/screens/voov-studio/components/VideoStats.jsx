import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { useVideoContext } from '../../../context/VideoContext';
import { useTheme } from '../../../context/ThemeContext';
import VideoGrid from '../../profile/components/VideoGrid';

// const VideoItem = ({ item, index, videoData }) => {
//   const navigation = useNavigation();
//   const { setActiveVideoId } = useVideoContext();
//   const { theme } = useTheme();

//   const openVideo = (item) => {
//     console.log('item in open video = ', item, item.id, videoData);
//     // setActiveVideoId(item.id || item.video_id);
//     navigation.navigate('FeedList', { video: item, index, userVideos: videoData, mode: 'user' });
//   }

//   return <TouchableOpacity style={styles.itemContainer} onPress={() => openVideo(item)}>
//     <Image source={{ uri: item.video_thumbnail }} style={styles.thumbnail} />
//     <View style={styles.info}>
//       <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{item.video_title}</Text>
//       <Text style={[styles.desc, { color: theme.text }]} numberOfLines={2}>{item.video_description}</Text>
//       <Text style={[styles.subText, { color: theme.text }]}>{item.views} views • {item.impressions} impressions</Text>
//       <Text style={[styles.subText, { color: theme.text }]}>Revenue: $ {item.revenue_usd}</Text>
//       <Text style={[styles.date, { color: theme.text }]}>{moment(item.created_at).format('DD MMM YYYY')}</Text>
//     </View>
//   </TouchableOpacity>
// };

const VideoStatistics = ({ videoData }) => {
  console.log('video data in video statistics = ', videoData);
  const navigation = useNavigation();

  const openVideosList = (video, index) => {
    console.log('video = ', video, index);
    // setActiveVideoId(video.id);
    navigation.navigate('FeedList', { video, index, userVideos: videoData, mode: 'user' })
  }

  return (
    <FlatList
      data={videoData}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => <VideoGrid video={item} index={index} openVideo={openVideosList} mode='studio' />}
      // <VideoItem item={item} index={index} videoData={videoData}
      contentContainerStyle={styles.container}
    />
  );
}

export default VideoStatistics;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#1e1e1e',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
    gap: 5
  },
  rank: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
    marginTop: 4,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 6,
    backgroundColor: '#444',
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  desc: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  subText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  date: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
});