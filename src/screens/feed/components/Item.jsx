import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useEffect, useRef, useState } from 'react'
import { Pressable } from 'react-native';
import { Dimensions } from 'react-native';
import Video, { ResizeMode } from 'react-native-video';
import SocialActions from '../../../components/SocialActions';
import GoogleAds from '../../../components/GoogleAds';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { APP_CONSTANTS } from '../../../config/constants';
import useAPIService from '../../../services/APIService';
import useGlobalFunctions from '../../../services/GlobalService';

const Item = memo(({ item, shouldPlay, mode, index, updateCurrentIndex }) => {
  const navigation = useNavigation();
  const { sendRequest } = useAPIService();
  const { get } = useGlobalFunctions();
  const video = useRef(null);
  const lastItemId = useRef(item.id);
  const [showAd, setShowAd] = useState(false);
  const [paused, setPaused] = useState(!shouldPlay);
  const status = useRef(shouldPlay);

  // Reset component state when item.id changes (recycled component)
  useEffect(() => {
    if (item.id !== lastItemId.current) {
      lastItemId.current = item.id;
      setShowAd(false);
      setPaused(!shouldPlay);
    }
  }, [item.id]);

  useEffect(() => {
    if (!video.current) return;

    // console.log('item = ', item.id);
    console.log('should play = ', shouldPlay, item.id);
    status.current = shouldPlay;
    // console.log('status = ', status.current);
  }, [shouldPlay])

  const handlePlay = () => {
    // console.log('status in handle play = ', status.current);
    if (status.current) {
      video.current?.pause();
      status.current = !status.current;
    } else {
      video.current?.resume();
      status.current = !status.current;
      updateCurrentIndex(index);
    }
  }

  const handleVideoEnd = () => {
    console.log('Video playback ended for item:', item.id);
    if (mode !== 'user') {
      setShowAd(true);
      setPaused(true);
    }
  };

  const handleAdClose = () => {
    setShowAd(false);
    if (video.current) {
      video.current.seek(0);
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

      <Pressable onPress={() => handlePlay()}>
        {showAd ? (
          <GoogleAds style={styles.video} onClose={handleAdClose} video={item} />
        ) : (
          <>
            <View style={styles.videoContainer}>
              <Video
                ref={video}
                poster={item.video_thumbnail}
                posterResizeMode="cover"
                source={{ uri: item.video_link }}
                paused={!shouldPlay}
                style={styles.video}
                repeat={mode == 'feed' ? false : true}
                resizeMode="cover"
                onEnd={handleVideoEnd}
                onError={(error) => console.error('Video error:', error)}
              />
            </View>
          </>
        )
        }
      </Pressable>



      <View style={[styles.videoDescription, mode == 'user' || mode == 'search' ? { bottom: '5%' } : { bottom: '18%' }]}>
        <Text style={styles.video_title}>{item.video_title}</Text>
        <Text style={styles.video_desc}>{item.video_description}</Text>
      </View>


      <SocialActions item={item} mode={mode} />
    </>
  );
});

export default Item;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    width: '100%',
    minHeight: '55%',
    position: 'absolute',
    bottom: '0%',
    // backgroundColor: 'orange',
    right: 10,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingRight: 10,
    // paddingBottom: '40%'
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
});