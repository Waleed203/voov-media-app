import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import AppHeader from '../../components/AppHeader';
import useGlobalFunctions from '../../services/GlobalService';
import useAPIService from '../../services/APIService';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { APP_CONSTANTS } from '../../config/constants';
import { createThumbnail } from 'react-native-create-thumbnail';

const EditVideo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showToast, get } = useGlobalFunctions();
  const { uploadVideo, sendRequest, uploadThumbnail } = useAPIService();
  const { theme } = useTheme();

  const [video, setVideo] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [loading, setLoading] = useState({
    videoLoading: false,
    postLoading: false,
  });

  useEffect(() => {
    const { videoData } = route.params || {};
    console.log('video data on edit video = ', videoData);
    if (videoData) {
      setVideo(videoData.video_link);
      setDescription(videoData.video_description);
      setVideoId(videoData.id);
    }
    getTokenFromStorage();
  }, []);

  const getTokenFromStorage = async () => {
    const token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
    if (!token) {
      setNotLoggedIn(true);
    }
  };

  const updateVideo = async () => {
    if (!videoId) {
      showToast('Missing video ID.');
      return;
    }

    if (!description?.trim()) {
      showToast('Please enter video description');
      return;
    }

    if (loading.videoLoading) {
      showToast('Please wait for the video upload to complete');
      return;
    }

    setLoading({ ...loading, postLoading: true });

    const params = {
      video_title: 'Video',
      video_description: description,
      id: videoId,
    };

    const res = await sendRequest('app_video_detail', params, 'POST', true);
    if (res.data.status) {
      showToast('Video updated successfully');
      navigation.goBack();
    }

    setLoading({ ...loading, postLoading: false });
  };

  const uploadAttachment = async (videoUri) => {
    setLoading({ ...loading, videoLoading: true });

    const upload = await uploadVideo(videoUri, 'appVideos', true, (progress) => {
      console.log(`Uploading: ${progress}%`);
    });

    if (upload.success) {
      const { id, video_link } = upload.data.data[0];
      setVideoId(id);
      setVideo(video_link);
      generateThumbnail(id, video_link);
      showToast('Video uploaded successfully');
    }

    setLoading({ ...loading, videoLoading: false });
  };

  const generateThumbnail = async (videoId, videoUri) => {
    createThumbnail({ url: videoUri, timeStamp: 1000 })
      .then(async (thumb) => {
        await uploadThumbnail(thumb.path, 'thumbnail', true, videoId);
        setThumbnail(thumb.path);
      })
      .catch((err) => {
        console.log('Thumbnail error:', err);
        showToast('Failed to generate thumbnail');
      });
  };

  const pickVideo = () => {
    if (notLoggedIn) {
      showToast('Please login to update video');
      return;
    }

    const options = { mediaType: 'video', videoQuality: 'high' };

    launchImageLibrary(options, async (response) => {
      if (response.assets && response.assets[0]?.uri) {
        const videoUri = response.assets[0].uri;
        setVideo(videoUri);
        uploadAttachment(videoUri);
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader title="Edit Video" showBack={true} />

      <View style={[styles.videoContainer, { backgroundColor: theme.mode === 'dark' ? '#1e1e1e' : theme.background, borderWidth: theme.mode === 'dark' ? 0 : 0.4, borderColor: theme.borderColor, height: video ? 350 : 100, justifyContent: video ? 'flex-start' : 'center' }]}>
        {video ? (
          <View style={{ flex: 1, width: '100%', alignItems: 'flex-start' }}>
            <Video
              source={{ uri: video }}
              style={[styles.videoPreview, { height: 300, width: '100%' }]}
              resizeMode="contain"
              controls
            />
            {
              !loading.videoLoading ? (
                <TouchableOpacity onPress={pickVideo} style={styles.changeVideoBtn}>
                  <Text style={{ color: theme.background }}>Change Video</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.loadingBar}>
                  <Text style={{ color: theme.text }}>Uploading Video</Text>
                  <ActivityIndicator size="small" color={theme.text} />
                </View>
              )
            }
          </View>
        ) : (
          <TouchableOpacity onPress={pickVideo} style={styles.uploadBox}>
            <Icon name="upload" size={20} color={theme.text} />
            <Text style={[styles.uploadText, { color: theme.text }]}>Select a Video</Text>
          </TouchableOpacity>
        )}
      </View>

      {thumbnail && <Image source={{ uri: thumbnail }} style={styles.thumbnail} />}

      <TextInput
        style={[styles.input, { color: theme.text, backgroundColor: theme.mode === 'dark' ? '#1e1e1e' : theme.background, borderColor: theme.borderColor }]}
        placeholder="Enter video description..."
        placeholderTextColor={theme.text}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {!loading.postLoading ? (
        <TouchableOpacity style={styles.uploadButton} onPress={updateVideo}>
          <Text style={styles.uploadButtonText}>Update Video</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.loadingBar}>
          <Text style={{ color: '#fff' }}>Updating Post</Text>
          <ActivityIndicator size="small" color={theme.text} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  videoContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
  },
  videoPreview: {
    width: '100%',
  },
  uploadBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 14,
    marginTop: 10,
  },
  changeVideoBtn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#47c2f0',
    width: '100%',
    borderRadius: 4,
    marginTop: 10,
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 15,
  },
  input: {
    padding: 10,
    height: 150,
    borderRadius: 8,
    fontSize: 14,
    textAlignVertical: 'top',
    borderWidth: 0.4,
  },
  uploadButton: {
    width: '100%',
    backgroundColor: '#47c2f0',
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#444',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default EditVideo;
