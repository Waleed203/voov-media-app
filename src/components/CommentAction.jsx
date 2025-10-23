import { FlatList, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAPIService from '../services/APIService';
import { Dimensions } from 'react-native';
import CommentCard from './CommentCard';
import { useSheetContext } from '../context/CommentSheetContext';

const height = Dimensions.get('window').height;

const CommentAction = React.memo(({ item }) => {
  const {sheetState, setSheetState, setVideoId} = useSheetContext();
  // console.log('comment action');

  const openSheet = () => {
    console.log('open sheet ref = ', sheetState)
    setSheetState('open');
    setVideoId(item.id || item.video_id);
  }

  return (
    <>
      <View style={styles.iconWrapper}>
        <Pressable onPress={openSheet}>
          <Ionicons name="chatbubble-ellipses" color="#fff" size={35} />
        </Pressable>
        <Text style={styles.iconText}>{item.comments}</Text>
      </View>
    </>
  )
});

export default CommentAction

const styles = StyleSheet.create({
  modal: {
    zIndex: 9999999,
    backgroundColor: '#222',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  commentContainer: {
    flex: 1,
    position: 'relative',
    minHeight: height * 0.5,
    // backgroundColor: 'red'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10
  },
  modalTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  commentsLength: {
    fontSize: 12,
    color: '#eee',
  },
  iconWrapper: {
    marginBottom: 15,
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
  commentFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    // backgroundColor: '#000',
    zIndex: 9999999999
  },
  commentInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#47c2f0',
    borderRadius: 50,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  }
})