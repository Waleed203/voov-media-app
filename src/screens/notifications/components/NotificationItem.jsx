import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import FastImage from "@d11/react-native-fast-image";
import config from '../../../config/config';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const NotificationItem = ({ notification, index = 0, removeNotification }) => {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  const { theme } = useTheme();
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

  const handleNotificationClick = () => {
    console.log('notification clicked = ', notification);
    if (notification.notification_type === 'follow') {
      navigation.navigate('GuestProfile', { userId: notification?.notification_from_detail?.userId });
    }

    if (notification.notification_type === 'like') {
      navigation.navigate('VideoPlayer', { videoId: notification?.video_detail?.id });
    }

    if (notification.notification_type === 'comments') {
      navigation.navigate('VideoPlayer', { videoId: notification?.video_detail?.id });
    }
  }

  return (
    // <Animated.View style={animatedStyle}>
      <Pressable style={[styles.container, { backgroundColor: theme.background }]} onPress={handleNotificationClick}>
        <View style={styles.imageContainer}>
          <FastImage
            source={
              notification?.notification_from_detail?.profileImage
                ? { uri: config.profileImage + notification?.notification_from_detail?.profileImage }
                : require('../../../assets/images/grey.jpg')
            }
            style={styles.image}
          />
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.body}>New
            {notification?.notification_type === 'follow'
              ? ' Follower'
              : notification?.notification_type === 'like'
              ? ' Like'
              : notification?.notification_type === 'comments'
              ? ' Comment'
              : notification?.notification_type === 'wishlist'
              ? ' Watchlist'
              : null}
          </Text>
          <Text style={styles.title}>
            <Text style={{ color: theme.primary }}>
              {notification?.notification_from_detail?.firstName || 'Voov User'} {notification?.notification_from_detail?.lastName}
            </Text>
            {notification?.notification_type === 'follow'
              ? ' followed you'
              : notification?.notification_type === 'like'
              ? ' liked your video'
              : notification?.notification_type === 'comments'
              ? ' commented on your video'
              : notification?.notification_type === 'wishlist'
              ? ' added your video to watchlist'
              : ''}
          </Text>
        </View>
        <Pressable onPress={() => removeNotification(notification)} style={styles.closeButton}>
          <Ionicons name="close" size={16} color="#000" />
        </Pressable>
      </Pressable>
    // </Animated.View>
  );
}

export default NotificationItem

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  bodyContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 300,
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 500,
    marginBottom: 4,
  },
  closeButton: {
    width: 20,
    height: 20,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    position: 'absolute',
    right: 10,
    top: 10,
  }
})