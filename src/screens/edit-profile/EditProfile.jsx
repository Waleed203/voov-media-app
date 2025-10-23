import React, { useEffect, useRef, useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, Pressable, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import AppHeader from '../../components/AppHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import config from '../../config/config';
import useAPIService from '../../services/APIService';
import useGlobalFunctions from '../../services/GlobalService';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '../../context/ThemeContext';

const EditProfile = () => {
	const data = useRoute().params.profile;
	const { uploadImage, sendRequest } = useAPIService();
	const { showToast } = useGlobalFunctions();
	const navigation = useNavigation();
	const { theme } = useTheme();

	const sheetRef = useRef();

	const [profileImage, setProfileImage] = useState(
		data.profileImage ? config.profileImage + data.profileImage : ''
	);

	const [loading, setLoading] = useState(false);

	const userRef = useRef({
		firstName: data.name ? data.name.split(' ')[0] : '',
		lastName: data.name ? data.name.split(' ')[1] : '',
		email: data.email || '',
		mobile: data.mobile || '',
		videoQuality: data.video_resolution_format || '720p',
		appLanguage: data.appLanguage || 'English',
		downloadWay: data.downloadWay || 'Mobile Data',
		autoPlay: data.autoPlay || 'Enabled',
	});

	const [activeDropdown, setActiveDropdown] = useState(null);

	const dropdownOptions = {
		videoQuality: [
			{ label: 'Full (HD) 720p', value: '720p' },
			{ label: 'HD 1080p', value: '1080p' },
			{ label: 'Standard 480p', value: '480p' },
		],
		appLanguage: [
			{ label: 'English', value: 'English' },
			{ label: 'Urdu', value: 'Urdu' },
		],
		downloadWay: [
			{ label: 'Mobile Data', value: 'Mobile Data' },
			{ label: 'WiFi', value: 'WiFi' },
			{ label: 'Both', value: 'Both' },
		],
		autoPlay: [
			{ label: 'Enabled', value: 'Enabled' },
			{ label: 'Disabled', value: 'Disabled' },
		],
	};

	const openSheet = (key) => {
		setActiveDropdown(key);
		sheetRef.current.open();
	};

	const handleSelect = (key, value) => {
		userRef.current[key] = value;
		sheetRef.current.close();
		// Optional: trigger a re-render if needed
		// forceUpdate(); // see next step
	};
	
	const capturePhoto = async () => {
		const imageRes = await launchImageLibrary({
			mediaType: 'photo',
			quality: 1,
		});

		if (imageRes.assets && imageRes.assets.length > 0) {
			const imageUri = imageRes.assets[0].uri;
			setProfileImage(imageUri);
			const upload = await uploadImage(imageUri, 'profileImage', true);
			if (upload.success) {
				showToast('Profile image updated successfully');
			}
		}
	};

	const updateProfile = async () => {
		console.log(userRef.current);
		setLoading(true);
		const update = await sendRequest('profile_update', userRef.current, 'POST', true);
		console.log(update);
		if (update.data.status) {
			showToast('Profile updated successfully');
			setLoading(false);
		}
	};

	const renderDropdownField = (label, key) => {
		const selected = dropdownOptions[key].find((item) => item.value === userRef.current[key]);
	
		return (
			<View style={styles.inputContainer}>
				<Text style={styles.label}>{label}</Text>
				<Pressable
					style={[
						styles.dropdown,
						{
							backgroundColor: theme.mode === 'dark' ? '#1E1E1E' : theme.background,
							borderColor: theme.mode === 'dark' ? 'transparent' : theme.borderColor,
							borderWidth: 0.4,
							padding: 10,
							borderRadius: 5,
						},
					]}
					onPress={() => openSheet(key)}
				>
					<Text style={{ fontSize: 14, color: theme.text }}>
						{selected?.label || 'Select'}
					</Text>
				</Pressable>
			</View>
		);
	};
	

	return (
		<View>
			<FlatList
				ListHeaderComponent={() => (
					<View style={[styles.container, { backgroundColor: theme.background }]}>
						<AppHeader
							title="Edit Profile"
							showBack={true}
							goBack={() => navigation.goBack()}
						/>

						<TouchableOpacity style={[styles.profileContainer, { backgroundColor: theme.background }]} onPress={capturePhoto}>
							<Image
								source={
									profileImage === ''
										? require('../../assets/images/grey.jpg')
										: { uri: profileImage }
								}
								style={styles.profileImage}
							/>
						</TouchableOpacity>

						<View style={styles.inputContainer}>
							<Text style={styles.label}>First Name</Text>
							<TextInput
								style={[
									styles.input,
									{
										backgroundColor: theme.mode === 'dark' ? '#1E1E1E' : theme.background,
										borderColor: theme.mode === 'dark' ? 'transparent' : theme.borderColor,
										borderWidth: 0.4,
										color: theme.text,
									}
								]}
								defaultValue={userRef.current.firstName}
								placeholderTextColor={theme.text}
								onChangeText={(text) => {
									userRef.current.firstName = text;
								}}
							/>

							<Text style={styles.label}>Last Name</Text>
							<TextInput
								style={[
									styles.input,
									{
										backgroundColor: theme.mode === 'dark' ? '#1E1E1E' : theme.background,
										borderColor: theme.mode === 'dark' ? 'transparent' : theme.borderColor,
										borderWidth: 0.4,
										color: theme.text,
									},
								]}
								defaultValue={userRef.current.lastName}
								placeholderTextColor={theme.text}
								onChangeText={(text) => {
									userRef.current.lastName = text;
								}}
							/>

							<Text style={styles.label}>Email</Text>
							<TextInput
								editable={false}
								style={[
									styles.input,
									{
										backgroundColor: theme.mode === 'dark' ? '#1E1E1E' : theme.background,
										borderColor: theme.mode === 'dark' ? 'transparent' : theme.borderColor,
										borderWidth: 0.4,
										color: theme.text,
									},
								]}
								defaultValue={userRef.current.email}
								keyboardType="email-address"
								placeholderTextColor={theme.text}
							/>

							<Text style={styles.label}>Phone Number</Text>
							<TextInput
								style={[
									styles.input,
									{
										backgroundColor: theme.mode === 'dark' ? '#1E1E1E' : theme.background,
										borderColor: theme.mode === 'dark' ? 'transparent' : theme.borderColor,
										borderWidth: 0.4,
										color: theme.text,
									},
								]}
								defaultValue={userRef.current.mobile}
								keyboardType="phone-pad"
								placeholder="Enter number"
								placeholderTextColor={theme.text}
								onChangeText={(text) => {
									userRef.current.mobile = text;
								}}
							/>


							{renderDropdownField('Download Video Quality', 'videoQuality')}
							{renderDropdownField('Preferred App Language', 'appLanguage')}
							{renderDropdownField('Mobile Data, WiFi', 'downloadWay')}
							{renderDropdownField('Auto Play', 'autoPlay')}
						</View>

						{
							loading ? (
								<TouchableOpacity style={[styles.uploadButton, { backgroundColor: theme.primary }]}>
									<ActivityIndicator size="small" color="#fff" />
								</TouchableOpacity>
							) : (
								<TouchableOpacity style={[styles.uploadButton, { backgroundColor: theme.primary }]} onPress={updateProfile}>
									<Text style={styles.uploadButtonText}>Update Profile</Text>
								</TouchableOpacity>
							)
						}
					</View>
				)}
			/>

			<RBSheet
				ref={sheetRef}
				height={300}
				openDuration={250}
				closeDuration={250}
				closeOnPressMask={true}
				customStyles={{
					container: {
						backgroundColor: '#1e1e1e',
						padding: 16,
					},
				}}
			>
				<Text style={{ fontSize: 18, fontWeight: 'bold', color: '#eee', marginBottom: 10 }}>
					Select {activeDropdown}
				</Text>
				{dropdownOptions[activeDropdown]?.map((item) => (
					<Pressable
						key={item.value}
						onPress={() => handleSelect(activeDropdown, item.value)}
						style={{
							paddingVertical: 14,
							borderBottomWidth: 0.2,
							borderBottomColor: '#eee',
						}}
					>
						<Text style={{ fontSize: 14, color: '#eee' }}>{item.label}</Text>
					</Pressable>
				))}
			</RBSheet>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#121212', // Dark mode
		padding: 20,
	},
	profileContainer: {
		alignItems: 'center',
		marginVertical: 20,
	},
	profileImage: {
		width: 120,
		height: 120,
		borderRadius: 100,
		// borderWidth: 2,
		// borderColor: '#fff',
	},
	cameraButton: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		backgroundColor: '#FFA500',
		borderRadius: 20,
		padding: 10,
		elevation: 3,
	},
	inputContainer: {
		marginTop: 10,
	},
	label: {
		color: '#bbb',
		fontSize: 14,
		marginBottom: 5,
	},
	dropdown: {
		backgroundColor: '#1E1E1E',
		color: '#fff',
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
		zIndex: 9
	},
	input: {
		backgroundColor: '#1E1E1E',
		color: '#fff',
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	activeItemStyle: {
		color: '#fff',
	},
	dropdownContainer: {
		backgroundColor: '#1E1E1E',
		color: '#fff'
	}, uploadButtonContainer: {
		// width: '100%',
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	uploadButton: {
		// width: '100%',
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

export default EditProfile;
