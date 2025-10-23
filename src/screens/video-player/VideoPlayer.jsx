import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable, Text } from 'react-native';
import Video from 'react-native-video';
import { useNavigation, useRoute } from '@react-navigation/native';
import useAPIService from '../../services/APIService';
import ProfileAction from '../../components/ProfileAction';
import LikeAction from '../../components/LikeAction';
import CommentAction from '../../components/CommentAction';
import WishlistAction from '../../components/WishlistAction';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import FastImage from "@d11/react-native-fast-image";
import useGlobalFunctions from '../../services/GlobalService';
import { APP_CONSTANTS } from '../../config/constants';
import { useSheetContext } from '../../context/CommentSheetContext';
import config from '../../config/config';

const VideoPlayer = () => {
  const route = useRoute();
  const { videoId } = route.params || {};
  const [isLiked, setIsLiked] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const videoRef = useRef(null);
  const { sendRequest } = useAPIService();
  const [video, setVideo] = useState(null);
  const [paused, setPaused] = useState(false);
  const { sheetState, setSheetState, setVideoId } = useSheetContext();

  const navigation = useNavigation();
  const { get } = useGlobalFunctions();

  const handleShare = async (video) => {
    console.log('share video = ', video);
    const shareOptions = {
      title: 'Check this out!',
      message: 'Watch this amazing video!',
      url: 'VoovFinal://video/' + video.video_id,
      failOnCancel: false,
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Error =>', error);
    }
  };

  useEffect(() => {
    console.log('video id deep link = ', videoId);
    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    return () => {
      console.log('video player unmounted');
      setPaused(true);
    };
  }, []);

  const fetchVideo = async () => {
    const response = await sendRequest('single_video_detail', { video_id: videoId }, 'GET', false);
    console.log('video response = ', response);
    if (response.data.status) {
      console.log('video = ', response.data.data);
      const video = response.data.data;
      if (video) {
        console.log('video = ', video);
        setVideo(video);
      }
    }
  }

  useEffect(() => {
    if (video) {
      checkLikeAndWishlist();
    }
  }, [video])

  const checkLikeAndWishlist = async () => {
    const loggedInUserId = await get(APP_CONSTANTS.STORAGE_KEYS.UID);
    console.log('logged in user id = ', loggedInUserId);
    if (!loggedInUserId) {
      return;
    }
    setIsLiked(video.like_members.includes(String(loggedInUserId)));
    setIsWishlisted(video.wishlist_members.includes(String(loggedInUserId)));
  }

  const onTogglePlay = () => {
    setPaused(!paused);
  }


  const gotoProfile = async () => {
    console.log('goto profile = ', video);

    const loggedInUserId = await get(APP_CONSTANTS.STORAGE_KEYS.UID);
    console.log('logged in user id = ', loggedInUserId);
    if (!loggedInUserId) {
      setPaused(true);
      navigation.navigate('Login');
      return;
    }
    if (video.user_id == loggedInUserId) {
      return;
    }
    navigation.navigate('GuestProfile', { userId: video.user_id, userData: video.user_details || video.user_detail })
  }

  const videoAction = async (action) => {
    console.log('action = ', action, video);
    const token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
    console.log('token from storage = ', token);
    if (!token) {
      navigation.navigate('Login');
      return;
    }

    if (action == 'heart') {
      let obj = {
        video_id: video.id || video.video_id,
        operation: '2',
        is_user_uploaded: 1
      };

      const res = await sendRequest('like_dislike_wishlist', obj, 'POST', true);
      console.log('like resp = ', res);

      if (res.data.message) {
        video.likes = res.data.message.includes("Remove") ? video.likes - 1 : video.likes + 1;
        setIsLiked(res.data.message.includes("Remove") ? false : true);
      }
    } else {
      let obj = {
        video_id: video.id || video.video_id,
        operation: '1',
        is_user_uploaded: 1
      };

      const res = await sendRequest('like_dislike_wishlist', obj, 'POST', true);
      console.log('wishlist resp = ', res);

      if (res.data.message) {
        video.wishlist = res.data.message.includes("Remove") ? video.wishlist - 1 : video.wishlist + 1;
        setIsWishlisted(res.data.message.includes("Remove") ? false : true);
      }
    }
  };

  const openSheet = () => {
    console.log('open sheet ref = ', sheetState)
    setSheetState('open');
    setVideoId(video.id || video.video_id);
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}>
        <Ionicons name="arrow-back" color='#fff' size={24} />
      </TouchableOpacity>
      {video && <Pressable style={styles.container} onPress={onTogglePlay}>
        <Video
          ref={videoRef}
          poster={video?.video_thumbnail}
          posterResizeMode='cover'
          source={{ uri: video?.video_link }}
          style={styles.video}
          resizeMode='cover'
          repeat={true}
          muted={false}
          controls={false}
          paused={paused}
          playInBackground={false}
          playWhenInactive={false}
          // onLoad={() => setVideoLoading(false)}
          onError={(error) => console.error('Video error:', error)}
        />
      </Pressable>}

      {video && <View style={styles.iconContainer}>


        <TouchableOpacity style={styles.iconWrapper} onPress={gotoProfile}>
          <FastImage
            source={
              (!video?.user_detail?.profileImage) ?
                require('../../assets/images/grey.jpg') :
                { uri: config.profileImage + video?.user_detail?.profileImage }
            }
            style={styles.img}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>


        <View style={styles.iconWrapper}>
          <Pressable onPress={() => videoAction('heart')}>
            <Ionicons name="heart" color={isLiked ? "#ff0202" : "#fff"} size={35} />
          </Pressable>
          <Text style={styles.iconText}>{video.likes}</Text>
        </View>

        <View style={styles.iconWrapper}>
          <Pressable onPress={openSheet}>
            <Ionicons name="chatbubble-ellipses" color="#fff" size={35} />
          </Pressable>
          <Text style={styles.iconText}>{video.comments}</Text>
        </View>


        <View style={styles.iconWrapper}>
          <Pressable onPress={() => videoAction('bookmark')}>
            <Ionicons name="bookmark" color={isWishlisted ? "gold" : "#fff"} size={30} />
          </Pressable>
          <Text style={styles.iconText}>{video.wishlist}</Text>
        </View>

        <TouchableOpacity style={styles.iconWrapper} onPress={() => handleShare(video)}>
          <Ionicons name="share" color="#fff" size={30} />
        </TouchableOpacity>
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  video: { flex: 1 },
  iconContainer: {
    width: '100%',
    minHeight: '55%',
    position: 'absolute',
    bottom: '0%',
    // backgroundColor: 'orange',
    right: 0,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingRight: 10,
    // paddingBottom: '40%'

  },
  iconWrapper: {
    marginBottom: 15,
    alignItems: 'center',
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  iconText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
});

export default VideoPlayer;
