import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Video from 'react-native-video';

const TestVideo = ({data, isActive}) => {
  console.log('video renders', data);
  const videoRef = useRef(null);

  useEffect(()=>{
    console.log('test video = ', videoRef.current);
  }, [])

  return (
    <Video
      style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
      ref={videoRef}
      posterResizeMode='contain'
      poster={'https://images.unsplash.com/photo-1596265371388-43edbaadab94?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
      source={{ uri: data.uri }}
      resizeMode='contain'
      paused={!isActive}
      repeat={true}
      muted={false}
      controls={false}
    />
  )
}

export default TestVideo

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
})