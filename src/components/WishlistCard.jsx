import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from "react-native-video";
import { useTheme } from "../context/ThemeContext";
import FastImage from "@d11/react-native-fast-image";
import moment from "moment";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const WishlistCard = ({ item, onRemove, openVideo, index = 0 }) => {
  const { theme } = useTheme();
  const translateY = useSharedValue(20);
    const opacity = useSharedValue(0);

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
      <Pressable onPress={() => openVideo(item, index)} style={[styles.card, { backgroundColor: theme.cardbg }]}>
        {
          <FastImage source={{
            uri: item.video_thumbnail,
            headers: {},
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable
          }}
            resizeMode={FastImage.resizeMode.cover}
            style={[styles.image, { backgroundColor: theme.cardbg }]} />
        }
        {/* Content */}
        <View style={[styles.content, { backgroundColor: theme.cardbg }]}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {item.video_title}
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]} numberOfLines={2}>
            {item.video_description}
          </Text>

          <Text style={[styles.text, { color: theme.text }]}>{item.unique_views} views • {item.likes} Likes</Text>
          <Text style={[styles.text, { color: theme.text }]}>{moment(item.created_at).format('DD MMM YYYY')}</Text>
        </View>

        <TouchableOpacity onPress={() => onRemove(item.id)} style={[styles.closeButton, { backgroundColor: theme.mode == 'dark' ? '#1E1E1E' : '#d3d3d3' }]}>
          <Ionicons name="close" size={14} color={theme.text} />
        </TouchableOpacity>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 10,
    alignItems: "start",
    marginBottom: 10
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 5,
  },
  content: {
    flex: 1,
    marginLeft: 10,
    gap: 10
  },
  title: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
    fontSize: 12,
  },
  closeButton: {
    width: 20,
    height: 20,
    backgroundColor: '#000',
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WishlistCard;
