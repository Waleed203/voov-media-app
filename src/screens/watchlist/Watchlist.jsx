import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import WishlistCard from '../../components/WishlistCard';
import useAPIService from '../../services/APIService';
import AppHeader from '../../components/AppHeader';
import useGlobalFunctions from '../../services/GlobalService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useVideoContext } from '../../context/VideoContext';
import { useTheme } from '../../context/ThemeContext';

const { height, width } = Dimensions.get('window');

const Watchlist = () => {
  const navigation = useNavigation();
  const { sendRequest } = useAPIService();
  const [wishlist, setWishlist] = useState(null);
  const { showToast } = useGlobalFunctions();
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const { theme } = useTheme();

  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, []),
  );

  const openVideosList = (video, index) => {
    console.log('video = ', video, index);
    // setActiveVideoId(video.id);
    navigation.navigate('FeedList', { video, index, userVideos: wishlist, mode: 'user' })
  }

  const loadWishlist = async () => {
    console.log('loading wishlist')
    try {
      const params = {};
      const response = await sendRequest('wishlist', params, 'POST', true);
      if (response.status) {
        console.log('wishlist videos = ', response.data);
        const wishlistRes = response.data;
        if (wishlistRes.status) {
          setWishlist(wishlistRes.data);
          setRefreshing(false);
        }
      } else {
        if (response.error == 'Token not found') {
          setNotLoggedIn(true);
        }
        setWishlist([]);
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const removeItem = async (id) => {
    let obj = {
      video_id: id,
      operation: '1',
      is_user_uploaded: 1
    };
    console.log('bookmark object = ', obj);
    const res = await sendRequest('like_dislike_wishlist', obj, 'POST', true);
    console.log('bookmark resp = ', res);

    if (res.data.status) {
      showToast(res.data.message);
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    loadWishlist();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader title="Watchlist" />
      {
        wishlist == null ?
          <ActivityIndicator size="large" color={theme.text} />
          :
          (
            wishlist.length > 0 ?
              <FlashList
                contentContainerStyle={{paddingBottom: 100}}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                data={wishlist}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => <WishlistCard item={item} index={index} onRemove={removeItem} openVideo={openVideosList}
              />
                }
              />
              :
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
                <Text style={{ color: theme.text, fontSize: 16 }}>No watchlist videos available</Text>
                {notLoggedIn &&
                  <TouchableOpacity style={{ marginTop: 10, backgroundColor: theme.primary, paddingHorizontal: 30, paddingVertical: 10, borderRadius: 5 }} onPress={() => navigation.navigate('Login')}>
                    <Text style={{ color: theme.background, fontSize: 16 }}>Login</Text>
                  </TouchableOpacity>
                }
              </View>
          )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
});

export default Watchlist;