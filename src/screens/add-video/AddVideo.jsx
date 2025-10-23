import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
// import { getThumbnail } from 'react-native-video-thumbnails';
import AppHeader from '../../components/AppHeader';
import useGlobalFunctions from '../../services/GlobalService';
import useAPIService from '../../services/APIService';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { APP_CONSTANTS } from '../../config/constants';
import { createThumbnail } from "react-native-create-thumbnail";

const AddVideo = () => {
	const { showToast } = useGlobalFunctions();
	const navigation = useNavigation();
	const { uploadVideo, sendRequest, uploadThumbnail } = useAPIService();
	const [videoId, setVideoId] = useState(null);
	const [video, setVideo] = useState(null);
	const { theme } = useTheme();
	const {get} = useGlobalFunctions();
	const [notLoggedIn, setNotLoggedIn] = useState(false);
	const [loading, setLoading] = useState({
		videoLoading: false,
		postLoading: false
	})
	const [thumbnail, setThumbnail] = useState(null);
	const [description, setDescription] = useState(null);

	useEffect(()=>{
		getTokenFromStorage();
		setLoading({videoLoading: false, postLoading: false})
	}, []);

	const getTokenFromStorage = async () => {
		const token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
		console.log('token from storage = ', token)
		if (!token) {
			setNotLoggedIn(true);
		}
	}

	const addVideoToDB = async () => {
		console.log('add video to db');
		if (!video) {
			showToast("Please select a video")
			return;
		}

		if (!description) {
			showToast("Please enter your post description")
			return;
		}

		
		if(loading.videoLoading) {
			showToast('Please wait until video upload is complete');
			return;
		}

		setLoading({ ...loading, postLoading: true });
		var params = {
			video_title: 'Video',
			video_description: description,
			video_type: 'shorts',
			id: videoId
		}
		console.log('params add video = ', params);
		const addVideoRes = await sendRequest('app_video_detail', params, 'POST', true);
		console.log('add video res = ', addVideoRes);
		if (addVideoRes.data.status) {
			showToast('Video Posted Successfully!');
			setLoading({ ...loading, postLoading: false });
			setVideo(null);
			setDescription(null);
			setVideoId(null);
			navigation.navigate('Tabs', { screen: 'Home' });
		}
	}

	const uploadAttachment = async (videoUri) => {
		console.log('video thumbnail = ', videoUri)
		// generateThumbnail(videoUri);
		setLoading({ ...loading, videoLoading: true });
		const upload = await uploadVideo(videoUri, 'appVideos', true, (progress) => {
			console.log(`Current Progress: ${progress}%`);
		});
		console.log('uploadVideo response = ', upload);
		if (upload.success) {
			generateThumbnail(upload.data.data[0].id, upload.data.data[0].video_link);
			showToast('Video Uploaded Successfully!');
			
			setVideoId(upload.data.data[0].id);
		}
	}

	const generateThumbnail = async (videoId, videoUri) => {
		console.log('generateThumbnail = ', videoId, videoUri);
		createThumbnail({
			url: videoUri,
			timeStamp: 1000,
		}).then(async (thumbnail) => {
			console.log('thumbnail = ', thumbnail);
			const uploadThumbnailRes = await uploadThumbnail(thumbnail.path, 'thumbnail', true, videoId);
			console.log('upload thumbnail res = ', uploadThumbnailRes)
			setLoading({ ...loading, videoLoading: false });
			// setThumbnail(thumbnail);
		}).catch((error) => {
			console.error('Error generating thumbnail:', error);
			showToast('Failed to generate thumbnail');
		});
	}

	const pickVideo = () => {
		if (notLoggedIn) {
			showToast('Please login to upload video');
			return;
		}
		const options = {
			mediaType: 'video',
			videoQuality: 'high',
		};

		launchImageLibrary(options, async (response) => {
			if (response.assets && response.assets[0]?.uri) {
				const videoUri = response.assets[0].uri;
				setVideo(videoUri);
				uploadAttachment(videoUri);
			}
		});
	};

	return (
		<View style={[styles.container, { backgroundColor: theme.background }]}>
			<AppHeader title="Add New Video" />

			{/* Video & Thumbnail Preview */}
			<View style={[styles.videoContainer, { backgroundColor: theme.mode === 'dark' ? '#1e1e1e' : theme.background, borderWidth: theme.mode === 'dark' ? 0 : 0.4, borderColor: theme.mode === 'dark' ? 'none' : theme.borderColor, height: video ? 350 : 100, justifyContent: video ? 'flex-start' : 'center' }]}>
				{video ? (
					<View style={{ flex: 1, width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start', borderColor: theme.borderColor, borderWidth: 0.4 }}>
						<Video
							source={{ uri: video }}
							style={[styles.videoPreview, { height: 300, width: '100%' }]}
							resizeMode="contain"
							controls
						/>
						{
							!loading.videoLoading ?
								<TouchableOpacity onPress={pickVideo} style={{ height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#47c2f0', width: '100%', borderRadius: 4, alignSelf: 'flex-start', marginTop: 10 }}>
									<Text style={{ color: theme.background }}>Change Video</Text>
								</TouchableOpacity>
								:
								<View style={{ height: 40, alignItems: 'center', flexDirection: 'row', gap: 20, justifyContent: 'center', backgroundColor: theme.mode == 'dark'? '#222': '#fff', width: '100%', borderRadius: 4, alignSelf: 'flex-start', marginTop: 10 }}>
									<Text style={{ color: theme.text }}>Uploading Video</Text>
									<ActivityIndicator size="small" color={theme.mode == 'dark'? '#fff': theme.text} />
								</View>
						}
					</View>
				) : (
					<TouchableOpacity onPress={pickVideo} style={styles.uploadBox}>
						<Icon name="upload" size={20} color={theme.text} />
						<Text style={[styles.uploadText, { color: theme.text }]}>Select a Video</Text>
					</TouchableOpacity>
				)}
			</View>

			{/* Thumbnail Preview */}
			{thumbnail && <Image source={{ uri: thumbnail }} style={[styles.thumbnail, { backgroundColor: theme.background, borderWidth: 0.4, borderColor: theme.borderColor }]} />}

			{/* Description Input */}
			<TextInput
				style={[styles.input, { color: theme.text, backgroundColor: theme.mode === 'dark' ? '#1e1e1e' : theme.background, borderWidth: theme.mode === 'dark' ? 0 : 0.4, borderColor: theme.mode === 'dark' ? 'none' : theme.borderColor }]}
				placeholder="Enter video description..."
				placeholderTextColor={theme.text}
				value={description}
				onChangeText={setDescription}
				multiline
			/>


			{!loading.postLoading ?
				<View style={styles.uploadButtonContainer}>
					<TouchableOpacity style={styles.uploadButton} onPress={addVideoToDB}>
						<Text style={styles.uploadButtonText}>Upload Video</Text>
					</TouchableOpacity>
				</View>
				:
				<View style={{ paddingVertical: 10, alignItems: 'center', flexDirection: 'row', gap: 20, justifyContent: 'center', backgroundColor: theme.primary, width: '100%', borderRadius: 8, alignSelf: 'flex-start', marginTop: 20 }}>
					<Text style={{ color: '#fff'}}>Uploading post</Text>
					<ActivityIndicator size="small" color={theme.text} />
				</View>
			}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
    backgroundColor: "#121212",
    padding: 10,
		position: 'relative',
	},
	videoContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#1a1a1a',
		height: 100,
		marginHorizontal: 10,
		borderRadius: 10,
		overflow: 'hidden',
		marginVertical: 20
	},
	videoPreview: {
		width: '100%',
		height: '100%',
	},
	videoPreview1: {

	},
	uploadBox: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	uploadText: {
		fontSize: 14,
		color: '#eee',
		marginTop: 10,
	},
	thumbnail: {
		width: 120,
		height: 120,
		borderRadius: 10,
		alignSelf: 'center',
		marginVertical: 15,
	},
	input: {
		borderWidth: 0.5,
		borderColor: '#ccc',
		padding: 10,
		height: 150,
		borderRadius: 8,
		fontSize: 14,
		textAlignVertical: 'top',
		marginHorizontal: 10,
	},
	uploadButtonContainer: {
		// width: '100%',
		justifyContent: 'center',
		alignItems: 'flex-start',
		marginHorizontal: 10,
	},
	uploadButton: {
		width: '100%',
		backgroundColor: "#47c2f0",
		paddingVertical: 10,
		paddingHorizontal: 30,
		borderRadius: 8,
		marginVertical: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	uploadButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default AddVideo;