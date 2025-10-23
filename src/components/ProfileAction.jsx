import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import config from '../config/config';
import { APP_CONSTANTS } from '../config/constants';
import FastImage from "@d11/react-native-fast-image";
import useGlobalFunctions from '../services/GlobalService';

const ProfileAction = ({ item }) => {
  const navigation = useNavigation();
  const {get} = useGlobalFunctions();
  console.log('item in profile action = ', item);

  const gotoProfile = async () => {
    console.log('goto profile = ', item);
    const loggedInUserId = await get(APP_CONSTANTS.STORAGE_KEYS.UID);
    console.log('logged in user id = ', loggedInUserId);
    if(!loggedInUserId){
      navigation.navigate('Login');
      return;
    }
    if (item.user_id == loggedInUserId) {
      return;
    }
    navigation.navigate('GuestProfile', { userId: item.user_id, userData: item.user_details || item.user_detail })
  }

  return (
    <TouchableOpacity style={styles.iconWrapper} onPress={gotoProfile}>
      <FastImage
        source={
          item.user_detail?.profileImage || item.user_details?.profileImage ?
            { uri: config.profileImage + (item.user_detail?.profileImage || item.user_details?.profileImage) } :
            require('../assets/images/grey.jpg')
        }
        style={styles.img}
        resizeMode={FastImage.resizeMode.cover}
      />
    </TouchableOpacity>
  )
}

export default ProfileAction

const styles = StyleSheet.create({
  iconWrapper: {
		marginBottom: 15,
		alignItems: 'center',
	},
	img: {
		width: 40,
		height: 40,
		borderRadius: 100,
	},
})