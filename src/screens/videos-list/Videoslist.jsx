import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useFocusEffect, useIsFocused, useRoute } from '@react-navigation/native';
import VideoCard from '../../components/VideoCard';
import { FlashList } from '@shopify/flash-list';
import { useVideoContext } from '../../context/VideoContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');

const Videoslist = () => {
	const { video, index, userVideos, mode } = useRoute().params;
	console.log({ video, index, userVideos, mode });
	const [activeLocalIndex, setActiveLocalIndex] = useState(index);
	const {setActiveVideoId} = useVideoContext();
	console.log('videos list = ', video.id, index);
	const isFocused = useIsFocused();

	useEffect(()=>{
		console.log('is focussed videos list = ', isFocused);

		return () => {
			console.log('in');
		}
	}, [isFocused]);

	const [playingIndex, setPlayingIndex] = useState(index);
	const flastList = useRef(null);

	const handleTogglePlay = (currentIndex) => {
		// setPlayingIndex(currentIndex);
		// setActiveVideoId(userVideos[currentIndex].id);
	};

	const viewabilityConfig = {
		itemVisiblePercentThreshold: 80,
		minimumViewTime: 100,
	};

	const onViewableItemsChanged = ({ viewableItems }) => {
		console.log('viewableItems in videos list = ', viewableItems);

		if (viewableItems.length == 1) {
			const currentVideo = viewableItems[0];
			console.log('Switched to video:', currentVideo);
			// setActiveLocalIndex(currentVideo.index);
			setActiveVideoId(currentVideo.item.id || currentVideo.item.video_id);
		}
	};

	// useEffect(()=>{
	// 	console.log('active local index changed', activeLocalIndex);
	// }, [activeLocalIndex])

	const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={{ backgroundColor: '#121212', flex: 1 }}>
				<FlashList
					ref={flastList}
					data={userVideos}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item, index }) => (<VideoCard item={item} index={index} mode={mode} />)}
					onViewableItemsChanged={onViewableItemsChanged}
					initialScrollIndex={index}
					estimatedItemSize={height}
					contentContainerStyle={{ backgroundColor: '#121212' }}
					pagingEnabled
					showsVerticalScrollIndicator={false}
					decelerationRate={"fast"}
					viewabilityConfig={viewabilityConfig}
				/>
			</View>
		</GestureHandlerRootView>
	)
}

export default Videoslist

const styles = StyleSheet.create({})