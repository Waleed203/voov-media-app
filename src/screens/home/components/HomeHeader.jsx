import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const HomeHeader = ({activeTab, setActiveTab}) => {
	const navigation = useNavigation();

	const gotoSearch = () => {
		navigation.navigate('Tabs', { screen: 'Search' });
	}

	return (
		<View style={styles.header}>
			{/* Logo */}
			<View style={styles.logoContainer}>
				<Image source={require('../../../assets/icon/logo.jpg')} style={styles.logoImage} />
			</View>

			<View style={styles.tabs}>
				<TouchableOpacity onPress={() => setActiveTab("Long")} style={styles.tabButton}>
					<Text style={[styles.tab, activeTab === "Long" && styles.activeTab]}>
						Long
					</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => setActiveTab("Short")} style={styles.tabButton}>
					<Text style={[styles.tab, activeTab === "Short" && styles.activeTab]}>
						Short
					</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity style={styles.searchIcon} onPress={gotoSearch}>
				<Icon name="magnify" size={28} color="#fff" />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		position: 'absolute',
		top: 20,
		left: 0,
		right: 0,
		zIndex: 999,
		backgroundColor: 'rgba(18, 18, 18, 0)',
		height: 60,
	},
	logoContainer: {
		flex: 1,
	},
	logoImage: {
		width: 80,
		height: 80,
		resizeMode: 'contain',
	},
	tabs: {
		flex: 2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 30,
	},
	tabButton: {
		paddingHorizontal: 10,
	},
	tab: {
		color: '#888',
		fontSize: 20,
		fontWeight: '600',
	},
	activeTab: {
		color: '#fff',
		fontWeight: '700',
	},
	searchIcon: {
		flex: 1,
		alignItems: 'flex-end',
	},
});

export default HomeHeader