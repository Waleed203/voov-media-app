import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import TestVideo from './TestVideo';
import { FlashList } from '@shopify/flash-list';

const Test = () => {
  const [activeId, setActiveId] = useState(1);
  const arrayNumbers = [
    {
      id: 1,
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      id: 2,
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      id: 3,
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },];

  // const renderItem = ({ item, index }) => (
  //   <View style={[
  //     { flex: 1, height: Dimensions.get('window').height, justifyContent: 'center', alignItems: 'center' }
  //   ]}>
  //     <TestVideo data={item} />
  //   </View>
  // );

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    console.log('viewableItems', viewableItems);

    if(viewableItems.length == 1) {
      setActiveId(viewableItems[0].item.id);
    }
  }, []);

  return (
    <View style={{ flex: 1, height: Dimensions.get('window').height }}>
      <FlashList
        data={arrayNumbers}
        renderItem={({ item }) => <TestVideo data={item} isActive={item.id === activeId} />}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        decelerationRate={"normal"}
        horizontal={false}
        estimatedItemSize={Dimensions.get('window').height}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </View>
  )

}

export default Test

const styles = StyleSheet.create({})