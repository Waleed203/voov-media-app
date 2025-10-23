import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import config from '../config/config';
import useAPIService from '../services/APIService';
import CommentAction from './CommentAction';
import LikeAction from './LikeAction';
import WishlistAction from './WishlistAction';
import ProfileAction from './ProfileAction';
import Share from 'react-native-share';

const SocialActions = ({ item, mode }) => {
	// console.log('social actions running');

	const handleShare = async (video) => {
		console.log('share video = ', video);
		const shareOptions = {
			title: 'Check this out!',
			message: 'Watch this amazing video:',
			url: 'https://app.voovmedia.com/video/'+video.id,
			failOnCancel: false,
		};
	
		try {
			await Share.open(shareOptions);
		} catch (error) {
			console.log('Error =>', error);
		}
	};

  return (
    <View style={[styles.iconContainer, mode == 'user' || mode == 'search' ? {bottom: '-10%'} : {bottom: '0%'}]}>
      
      <ProfileAction item={item} />
      <LikeAction item={item} />
      <CommentAction item={item} />
      <WishlistAction item={item} />
      
      <TouchableOpacity style={styles.iconWrapper} onPress={() => handleShare(item)}>
        <Ionicons name="share" color="#fff" size={35} />
      </TouchableOpacity>
    </View>
  );
}

export default SocialActions;

const styles = StyleSheet.create({
  iconContainer: {
    width: '100%',
    minHeight: '55%',
		position: 'absolute',
		bottom: '0%',
    // backgroundColor: 'orange',
		right: 10,
		flexDirection: 'column',
		alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingRight: 10,
    // paddingBottom: '40%'
    
	},
	iconWrapper: {
		marginBottom: 15,
		alignItems: 'center',
	},
	img: {
		width: 40,
		height: 40,
		borderRadius: 100,
	},
	iconText: {
		color: '#fff',
		fontSize: 14,
		marginTop: 2,
	},
})