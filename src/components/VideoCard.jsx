import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Dimensions, StyleSheet, Pressable, Image, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import SocialActions from './SocialActions';
import VideoAction from './VideoAction';
import { useVideoContext } from '../context/VideoContext';

const { height, width } = Dimensions.get('window');

const VideoCard = ({ item, index, mode }) => {
  console.log('video card reloaded');
  const isFocused = useIsFocused();
  const { setActiveVideoId } = useVideoContext();

  useFocusEffect(
    useCallback(() => {
      console.log('focusses video card = ', isFocused);
      if (!isFocused) {
        setActiveVideoId(null);
      } else {
        // setActiveVideoId(item.id);
      }
    }, [])
  );

  return (
    <View style={{ width, height }}>
      <VideoAction item={item} mode={mode} />
      <SocialActions item={item} mode={mode} />
    </View>
  );
};

const styles = StyleSheet.create({

});

export default VideoCard;