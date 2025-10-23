import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import useAPIService from '../services/APIService';
import useGlobalFunctions from '../services/GlobalService';
import { APP_CONSTANTS } from '../config/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const WishlistAction = ({ item }) => {
  // console.log('wishlist action')
  const { sendRequest } = useAPIService();
  const lastItemId = useRef(item.id);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { get } = useGlobalFunctions();
  const navigation = useNavigation();

  const checkIfInWishlist = async () => {
    const userId = await get(APP_CONSTANTS.STORAGE_KEYS.UID);

    if (item.id !== lastItemId.current) {
      lastItemId.current = item.id;
    }

    setIsWishlisted(item.wishlist_members.includes(String(userId)));
  }

  useEffect(() => {
    checkIfInWishlist();
  }, [item]);

  const videoAction = async (action) => {
    console.log('action = ', action, item);
    const token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
    console.log('token from storage = ', token)
    if (!token) {
      navigation.navigate('Login');
      return;
    }
    let obj = {
      video_id: item.id || item.video_id,
      operation: '1',
      is_user_uploaded: 1
    };

    const res = await sendRequest('like_dislike_wishlist', obj, 'POST', true);
    console.log('wishlist resp = ', res);

    if (res.data.message) {
      item.wishlist = res.data.message.includes("removed") ? item.wishlist - 1 : item.wishlist + 1;
      setIsWishlisted(res.data.message.includes("removed") ? false : true);
    }
  };

  return (
    <View style={styles.iconWrapper}>
      <Pressable onPress={() => videoAction('bookmark')}>
        <Ionicons name="bookmark" color={isWishlisted ? "gold" : "#fff"} size={35} />
      </Pressable>
      <Text style={styles.iconText}>{item.wishlist}</Text>
    </View>
  )
}

export default WishlistAction;

const styles = StyleSheet.create({
  iconWrapper: {
    marginBottom: 15,
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
})