import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import FastImage from "@d11/react-native-fast-image";
import config from '../../../config/config';
import { useNavigation } from '@react-navigation/native';
import { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const UserStatsItem = ({ data, index = 0, mode }) => {
  // console.log('user stats data = ', data);
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  const navigation = useNavigation();

  useEffect(() => {
    const delay = index * 100;
    translateY.value = withDelay(delay, withTiming(0, { duration: 400 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
    <Pressable style={styles.container} onPress={() => navigation.navigate('GuestProfile', { userId: data.userId || data.user_id })}>
      <View style={styles.imageContainer}>
        {
          mode == 'search' ? 
          <FastImage
          source={
            data?.profile_image && (data?.profile_image.includes('googleusercontent') || data?.profile_image.includes('fbsbx'))
              ? {uri: data?.profile_image}
              :
              data?.profile_image && (!data?.profile_image.includes('googleusercontent') || !data?.profile_image.includes('fbsbx'))
              ? { uri: config.profileImage + data?.profile_image }
              : require('../../../assets/images/grey.jpg')
          }
          style={styles.image}
        />
        :
        <FastImage
          source={
            data?.profileImage && (data?.profileImage.includes('googleusercontent') || data?.profileImage.includes('fbsbx'))
              ? {uri: data?.profileImage}
              :
              data?.profileImage && !data?.profileImage.includes('googleusercontent')
              ? { uri: config.profileImage + data?.profileImage }
              : require('../../../assets/images/grey.jpg')
          }
          style={styles.image}
        />
        }
      </View>
      <Text style={styles.name}>{data.name == '' || data.name == ' ' ? 'Voov User' : data.name}</Text>
    </Pressable>
    </Animated.View>
  )
}

export default UserStatsItem

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
})