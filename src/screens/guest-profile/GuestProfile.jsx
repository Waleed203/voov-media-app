import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AppHeader from '../../components/AppHeader';
import useAPIService from '../../services/APIService';
import useGlobalFunctions from '../../services/GlobalService';
import { useNavigation, useRoute } from '@react-navigation/native';
import UserInfo from '../profile/components/UserInfo';
import VideoGrid from '../profile/components/VideoGrid';
import { useTheme } from '../../context/ThemeContext';

const GuestProfile = () => {
	const { sendRequest } = useAPIService();
	const [profile, setProfile] = useState({});
	const navigation = useNavigation();
	const [userVideos, setUserVideos] = useState([]);
	const [userData, setUserData] = useState({});
	const {theme} = useTheme();
	
	const { showToast, get } = useGlobalFunctions();
	const userId = useRoute().params?.userId;
	// const userData = useRoute().params?.userData;
	
	// console.log('userData = ', userData);

	useEffect(() => {
		fetchProfile(userId);
		fetchUserVideos(userId);
	}, [])

	const fetchProfile = async (id) => {
		try {
			const params = { user_id: id };
			const response = await sendRequest('profile', params, 'GET', false);
			console.log('guest profile response = ', response);
			const profileRes = response.data;
			if (profileRes.status) {
				setUserData(profileRes.data);
			}
		} catch (error) {
			console.error('Error fetching profile:', error);
		}
	}
  
	const fetchUserVideos = async (id) => {
		try {
			const params = { user_id: userId, page: 1 };
			const response = await sendRequest('user_uploaded_videos', params, 'GET', false);
			console.log('guest user videos = ', response);
			const userVideosRes = response.data;
			if (userVideosRes.status) {
				setUserVideos(userVideosRes.data.user_videos);
			}
		} catch (error) {
			console.error('Error fetching profile:', error);
		}
	};

	// const fetchProfile = async () => {
	// 	try {
	// 		const params = {};
	// 		const response = await sendRequest('profile', params, 'POST', true);
	// 		console.log('guest profile response = ', response);
	// 		const profileRes = response.data;
	// 		if (profileRes.status) {
	// 			fetchUserVideos(profileRes.data.user_basic_info.userId);
	// 			setProfile(profileRes.data.user_basic_info);
	// 		}
	// 	} catch (error) {
	// 		console.error('Error fetching profile:', error);
	// 	}
	// };

	const gotoSettings = () => {
		navigation.navigate('Settings');
	}

	const openVideosList = (video, index) => {
		console.log('video in guest profile = ', index);
		navigation.navigate('FeedList', { video, index, userVideos, mode: 'guest' })
	}

	return (
		<View style={[styles.container, { backgroundColor: theme.background }]}>
			<FlatList ListHeaderComponent={() => {
				return (
					<>
						<AppHeader title={userData.name} showSettings={true} openSettings={gotoSettings} showBack={true} />
						<UserInfo
							mode="guest"
							user={userData}
							onEditProfile={() => navigation.navigate('EditProfile', { profile })}
							onEditBio={() => console.log("Edit Bio")}
						/>
						<FlatList
							data={userVideos}
							renderItem={({ item, index }) => <VideoGrid mode="guest" video={item} index={index} openVideo={openVideosList} />}
							keyExtractor={(item) => item.id}
							numColumns={3}
							contentContainerStyle={styles.container}
						/>
					</>
				);
			}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
		padding: 10,
	},
});

export default GuestProfile;