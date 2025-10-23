import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import useGlobalFunctions from '../services/GlobalService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { APP_CONSTANTS } from '../config/constants';
import useAPIService from '../services/APIService';
import { useNavigation } from '@react-navigation/native';

const LikeAction = ({item}) => {
  // console.log('like action')
  const [isLiked, setIsLiked] = useState(false);
  const lastItemId = useRef(item.id);
  const {sendRequest} = useAPIService();
  const { get } = useGlobalFunctions();
  const navigation = useNavigation();

  useEffect(() => {
    checkIfLiked();
  }, [item]);

  const checkIfLiked = async () => {
    const userId = await get(APP_CONSTANTS.STORAGE_KEYS.UID);
    
    if (item.id !== lastItemId.current) {
      lastItemId.current = item.id;
    }
    
    setIsLiked(item.like_members.includes(String(userId)));
  }

  useEffect(() => {
    console.log('is liked = ', isLiked, item.id);
  }, [isLiked]);

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
      operation: '2',
      is_user_uploaded: 1
    };

    const res = await sendRequest('like_dislike_wishlist', obj, 'POST', true);
    console.log('like resp = ', res);

    if (res.data.message) {
      console.log('in it', res.data.message.includes("removed"))
      item.likes = res.data.message.includes("removed") ? item.likes - 1 : item.likes + 1;
      setIsLiked(res.data.message.includes("removed") ? false : true);
    }
  };

  return (
    <View style={styles.iconWrapper}>
      <Pressable onPress={() => videoAction('heart')}>
        <Ionicons name="heart" color={isLiked ? "#ff0202" : "#fff"} size={35} />
      </Pressable>
      <Text style={styles.iconText}>{item.likes}</Text>
    </View>
  );
}

export default LikeAction;

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