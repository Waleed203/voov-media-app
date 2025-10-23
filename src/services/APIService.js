import axios from 'axios';
import { ToastAndroid } from 'react-native';
import APPCONFIG from '../config/config';
import { APP_CONSTANTS } from '../config/constants';
import useGlobalFunctions from './GlobalService';
import RNFS from 'react-native-fs';

const useAPIService = () => {
  const { get } = useGlobalFunctions();

  const apiClient = axios.create({
    baseURL: APPCONFIG.apiUrl,
    timeout: APPCONFIG.apiTimeout,
    headers: APP_CONSTANTS.API_HEADERS,
  });

  const sendRequest = async (
    action,
    params = {},
    method = 'GET',
    token = false,
    tokenType = ''
  ) => {
    try {
      let response;
      let stored_token;

      if (token) {
        if (tokenType == 'forgot') {
          stored_token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN_FORGOT, 'string');
        } else {
          stored_token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN, 'string');
        }
        console.log('stored_token = ', stored_token);
        if (stored_token == null) {
          return { success: false, error: 'Token not found' };
        }
      }

      const remainingHeaders = {
        headers: token ? { Authorization: `Bearer ${stored_token}` } : {},
      };

      if (method.toUpperCase() === 'GET') {
        console.log('request url = ', APPCONFIG.apiUrl + action)
        // eventually i want my get request to become like this
        // 'uploaded_videos_list?user_id=null&video_type='+type+'&page='+page
        response = await apiClient.get(action, { ...remainingHeaders, params });
      } else if (method.toUpperCase() === 'POST') {
        response = await apiClient.post(action, params, remainingHeaders);
      } else {
        throw new Error('Unsupported request method');
      }

      console.log('response = ', response);
      return response;
    } catch (error) {
      console.log('API Request Error:', error.response);
      if (error.response?.data.message === "user exists") {
        return { success: true, data: error.response?.data };
      }
      // ToastAndroid.show(
      //   error.response?.data?.message || 'Request failed!',
      //   ToastAndroid.LONG,
      // );

      throw { success: false, error: error.response?.data };
    }
  };

  const uploadThumbnail = async (imageUri, appendKey, token, id) => {
    console.log('imageUri = ', imageUri);
    let stored_token;

    if (token) {
      stored_token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN, 'string');
      console.log('stored_token = ', stored_token);
    }

    const formData = new FormData();
    formData.append(appendKey, {
      uri: imageUri,
      name: Math.random().toString(36).substring(2, 8) + '.jpg',
      type: 'image/jpeg',
    });
    formData.append('id', id);

    try {
      const response = await apiClient.post('app_video_thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token ? `Bearer ${stored_token}` : '',
        },
      });
      console.log('Upload Success:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Upload Error:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const uploadImage = async (imageUri, appendKey, token) => {
    console.log('imageUri = ', imageUri);
    let stored_token;

    if (token) {
      stored_token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN, 'string');
      console.log('stored_token = ', stored_token);
    }

    const formData = new FormData();
    formData.append(appendKey, {
      uri: imageUri,
      name: Math.random().toString(36).substring(2, 8) + '.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await apiClient.post('profileImage_update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token ? `Bearer ${stored_token}` : '',
        },
      });
      console.log('Upload Success:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Upload Error:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const uploadVideo = async (videoUri, appendKey, token, onProgress) => {
    console.log('videoUri = ', videoUri);
    console.log('appendKey = ', appendKey);
    console.log('token = ', token);

    let stored_token;

    if (token) {
      stored_token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN, 'string');
      console.log('stored_token = ', stored_token);
    }

    var video_obj = {
      uri: videoUri,
      name: `${Math.random().toString(36).substring(2, 8)}.mp4`,
      type: 'video/mp4',
    }

    console.log('video object = ', video_obj);

    const fileStat = await RNFS.stat(videoUri);
    console.log('fileStat = ', fileStat);
    const formData = new FormData();

    formData.append(appendKey, {
      uri: fileStat.path,
      name: `${Math.random().toString(36).substring(2, 8)}.mp4`,
      type: 'video/mp4',
    });

    formData.append('video_type', 'short');

    try {
      const response = await fetch(`${APPCONFIG.apiUrl}app_videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${stored_token}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log('Upload Success:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Upload Error:', error);
      return { success: false, error: error.message };
    }



    // const formData = new FormData();
    // formData.append(appendKey, video_obj);
    // formData.append('video_type', 'short');

    // try {
    //   const response = await apiClient.post('app_videos', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Authorization': token ? `Bearer ${stored_token}` : '',
    //     },
    //     transformRequest: [(data, headers) => data],
    //     onUploadProgress: (progressEvent) => {
    //       const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
    //       console.log(`Upload Progress: ${progress}%`);


    //       if (onProgress) {
    //         onProgress(progress);
    //       }
    //     },
    //   });

    //   console.log('Upload Success:', response);
    //   return { success: true, data: response };
    // } catch (error) {
    //   console.error('Upload Error:', error.response?.data || error.message);
    //   return { success: false, error: error.response?.data || error.message };
    // }
  };



  return { sendRequest, uploadImage, uploadVideo, uploadThumbnail };
};

export default useAPIService;
