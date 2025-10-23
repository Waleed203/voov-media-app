import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import useGlobalFunctions from '../../../services/GlobalService';
import useAPIService from '../../../services/APIService';
import VideoGrid from './VideoGrid';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { APP_CONSTANTS } from '../../../config/constants';
import { useVideoContext } from '../../../context/VideoContext';
import { useTheme } from '../../../context/ThemeContext';

const UserVideos = ({ mode }) => {
  const { sendRequest } = useAPIService();
  const navigation = useNavigation();
  const { showToast, get } = useGlobalFunctions();
  const [userVideos, setUserVideos] = useState([]);
  const { setActiveVideoId } = useVideoContext();
  const [loggedIn, setLoggedIn] = useState(true);
  const theme = useTheme();

  useFocusEffect(
    useCallback(() => {
      fetchUserVideos();
    }, []),
  );

  const fetchUserVideos = async () => {
    const id = await get(APP_CONSTANTS.STORAGE_KEYS.UID);
    console.log('uid = ', id);
    if (!id) {
      setLoggedIn(false);
      return;
    }
    try {
      const params = {
        id: id,
        video_type: 'shorts',
        page: 1,
      };
      const response = await sendRequest('getUserVideos', params, 'GET', true);
      console.log('user videos = ', response);
      const userVideosRes = response.data;
      if (userVideosRes.status) {
        setUserVideos(userVideosRes.data.videos);
      }
    } catch (error) {
      console.error('Error fetching user videos:', error);
    }
  };

  const openVideosList = (video, index) => {
    console.log('video = ', video, index);
    // setActiveVideoId(video.id);
    navigation.navigate('FeedList', { video, index, userVideos, mode })
  }

  const deleteUserVideoFunc = async (videoId) => {
    try {
      const params = {
        video_id: videoId,
      };
      const response = await sendRequest('delete_unlink_video', params, 'POST', true);
      return response;
    } catch (error) {
      console.error('Error deleting user video:', error);
    }
  }

  const handleDelete = (videoId, index) => {
    console.log('video id = ', videoId, index);
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const res = await deleteUserVideoFunc(videoId);
              console.log('delete res = ', res);
              if (res.status == 200) {
                setUserVideos(prev => prev.filter((video, i) => i !== index));
              }
            } catch (err) {
              console.log('Error deleting video:', err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  const handleEdit = (video) => {
    console.log('video data = ', video);
    navigation.navigate('EditVideo', { videoData: video });
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <FlatList
        data={userVideos}
        renderItem={({ item, index }) => (
          <VideoGrid
            video={item}
            index={index}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            openVideo={openVideosList}
            mode={mode}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={userVideos.length === 0 ? styles.emptyContainer : styles.container}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emoji}>📹</Text>
            <Text style={styles.emptyText}>No videos yet</Text>

            {/*<TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('Add Video')}>*/}
            {/*  <Text style={styles.editProfileText}>*/}
            {/*    Upload Video*/}
            {/*  </Text>*/}
            {/*</TouchableOpacity>*/}
          </View>
        )}
      />



      {
        loggedIn ? null : (
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.editProfileText}>
              Login
            </Text>
          </TouchableOpacity>
        )
      }


    </View>
  )
}

export default UserVideos

const styles = StyleSheet.create({
  container: {},
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#888',
  },
  editProfileButton: {
    backgroundColor: "#47c2f0",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 10,
  },
  editProfileText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  loginBtn: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: "#47c2f0",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  }
})