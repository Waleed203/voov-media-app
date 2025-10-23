import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

import config from '../config/config';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const height = Dimensions.get('window').height;

const CommentCard = ({ item, handleDeleteComment }) => {
	const { theme } = useTheme();
	// console.log('comments in card = ', item);

	return (
		<View style={{ backgroundColor: theme.cardbg, minHeight: 20, paddingHorizontal: 10, paddingVertical: 15, flexDirection: 'row', zIndex: 9999999, borderRadius: 8, borderBottomColor: '#a0a0a0', borderBottomWidth: 0.2, zIndex: 9999999999 }}>
			<Image
				source={
					item.profile_image == "" ?
						require('../assets/images/tom.jpg') :
						{ uri: config.profileImage + item.profile_image }
				}
				style={{ width: 35, height: 35, borderRadius: 25 }}
			/>
			<View style={{ flex: 1, marginLeft: 10 }}>
				<Text style={{ fontSize: 15, fontWeight: 'bold', color: theme.text }}>{
					(item.comment_by == ' ' || item.comment_by == '' || item.comment_by == null) ?
						'Voov User'
						:
						item.comment_by
				}</Text>
				<Text style={{ fontSize: 13, color: theme.text }}>{item.comments}</Text>
			</View>
			{/* <TouchableOpacity onPress={handleDeleteComment} style={{ flex: 1, marginLeft: 10, alignItems: 'flex-end', zIndex: 9999999999 }}>
				<Ionicons name="close" color={theme.mode === 'light' ? '#333' : '#d3d3d3'} size={16} />
			</TouchableOpacity> */}
		</View>
	)
}

export default CommentCard

const styles = StyleSheet.create({})