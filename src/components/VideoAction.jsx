
import { Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import GoogleAds from './GoogleAds';
import Video from 'react-native-video';
import { useVideoContext } from '../context/VideoContext';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const VideoAction = ({
  item,
  mode
}) => {
  console.log('video action loaded');
  const videoRef = useRef(null);
  const [showAd, setShowAd] = useState(false);
  const [paused, setPaused] = useState(false);
  const { theme } = useTheme();
  const navigation = useNavigation();

  const { adShownVideoIds, markAdAsShown, setActiveVideoId, activeVideoId } = useVideoContext();
  console.log('active video id video action = ', activeVideoId, item.id || item.video_id);

  useEffect(() => {
    const isActive = activeVideoId === item.id || activeVideoId === item.video_id;
    setPaused(!isActive);
    setShowAd(adShownVideoIds.includes(item.id || item.video_id));
  }, [item.id, activeVideoId, adShownVideoIds]);

  const onTogglePlay = () => {
    if (!showAd) {
      setPaused(!paused);
      setActiveVideoId(item.id || item.video_id);
    }
  }

  useEffect(() => {
    return () => {
      console.log('video action unmounted');
      setActiveVideoId(null);
      videoRef.current?.pause();
    };
  }, []);

  const handleVideoEnd = () => {
    if (activeVideoId === item.id || activeVideoId === item.video_id) {
      console.log('Video playback ended for item:', item.id);
      if (mode !== 'user') {
        setShowAd(true);
        markAdAsShown(item.id || item.video_id);
        setPaused(true);
      }
    }
  };

  const handleAdClose = () => {
    setShowAd(false);
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
  };

  return (
    <>
      {
        (mode == 'user' || mode == 'search') &&
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}>
          <Ionicons name="arrow-back" color='#fff' size={24} />
        </TouchableOpacity>
      }
      <Pressable onPress={onTogglePlay} style={[styles.container, { backgroundColor: theme.background }]}>
        {showAd ? (
          <GoogleAds style={styles.video} onClose={handleAdClose} video={item} />
        ) : (
          <>
            <Video
              ref={videoRef}
              poster={item.video_thumbnail}
              posterResizeMode='cover'
              source={{ uri: item.video_link }}
              style={styles.video}
              resizeMode='cover'
              repeat={mode === 'user' ? true : false}
              muted={false}
              controls={false}
              paused={paused}
              playInBackground={false}
              playWhenInactive={false}
              onEnd={handleVideoEnd}
              // onLoad={() => setVideoLoading(false)}
              onError={(error) => console.error('Video error:', error)}
            />
          </>
        )}
      </Pressable>


      <View style={[styles.videoDescription, mode == 'user' || mode == 'search' ? { bottom: '5%' } : { bottom: '18%' }]}>
        <Text style={styles.video_title}>{item.video_title}</Text>
        <Text style={styles.video_desc}>{item.video_description}</Text>
      </View>
    </>
  );
};

export default VideoAction;

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoDescription: {
    position: 'absolute',
    bottom: '18%',
    left: 20,
  },
  video_title: {
    fontSize: 16,
    color: '#eee'
  },
  video_desc: {
    fontSize: 12,
    color: '#aeaeae'
  },
})