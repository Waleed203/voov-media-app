import React from 'react';
import { View, Modal, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import config from '../../config/config';
import FastImage from "@d11/react-native-fast-image";

const ImageViewerScreen = () => {
  const route = useRoute();
  const { imageUrl, width, height } = route.params;

  console.log('image url = ', imageUrl);
  console.log('width = ', width);
  console.log('height = ', height);

  return (
    <FastImage
      source={
        imageUrl && (imageUrl.includes('googleusercontent') || imageUrl.includes('fbsbx'))
          ? { uri: imageUrl }
          :
          imageUrl && (!imageUrl.includes('googleusercontent') || !imageUrl.includes('fbsbx'))
            ? { uri: config.profileImage + imageUrl }
            : require('../../assets/images/grey.jpg')
      }
      style={{ width, height }}
    />
  );
};

export default ImageViewerScreen;