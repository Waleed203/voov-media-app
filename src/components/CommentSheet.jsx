import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSheetContext } from '../context/CommentSheetContext';
import useAPIService from '../services/APIService';
import CommentCard from './CommentCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable, TextInput } from 'react-native-gesture-handler';
import { useTheme } from '../context/ThemeContext';
import useGlobalFunctions from '../services/GlobalService';
import { useNavigation } from '@react-navigation/native';
import { APP_CONSTANTS } from '../config/constants';

import ActionSheet from "react-native-actions-sheet";

const height = Dimensions.get('window').height;

const CommentSheet = () => {
  const sheetRef = useRef(null);
  const actionSheetRef = useRef(null);
  const { videoId, sheetState, setSheetState } = useSheetContext();
  const [userComment, setUserComment] = useState('');
  const { sendRequest } = useAPIService();
  const { get } = useGlobalFunctions();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    console.log('data from comment sheet = ', sheetState);
    if (sheetState == 'open') {
      console.log('inside = ', sheetState);
      console.log('opening sheet');
      sheetRef?.current?.open();
      // actionSheetRef.current?.show();
    }
  }, [sheetState])

  useEffect(() => {
    console.log('video id in use effect = ', videoId, comments);
    // fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      console.log('video id in fetch comments = ', videoId);
      if(videoId == '' || videoId == null) return;
      var params = { video_id: videoId, is_user_uploaded: 1 }
      const response = await sendRequest('videos_comments', params, 'GET', false);
      var commentsRes = response.data;
      console.log('commentsRes = ', commentsRes);
      if (commentsRes.status) {
        setComments(commentsRes.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSendComment = async () => {
    console.log('inside handle send');
    const token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
    console.log('token from storage = ', token)
    if (!token) {
      sheetRef?.current?.close();
      navigation.navigate('Login');
      return;
    }
    const comment = userComment?.trim();
    console.log('user comment = ', userComment)
    if (!comment) return;

    try {
      const payload = {
        video_id: videoId,
        comment,
        is_user_uploaded: 1,
      };
      console.log('payload = ', payload);
      const response = await sendRequest('add_video_comments', payload, 'POST', true);
      const res = response.data;
      console.log('res comment = ', res);
      if (res.status) {
        setUserComment('');
        fetchComments();
      }
    } catch (err) {
      console.error('Failed to send comment:', err);
    }
  };

  const handleDeleteComment = async (comment) => {
    console.log('inside handle delete comment', comment);
    try {
      const payload = {
        comment_id: comment.id,
      };
      console.log('payload = ', payload);
      const response = await sendRequest('remove_video_comment', payload, 'POST', true);
      const res = response.data;
      console.log('res comment = ', res);
      if (res.status) {
        // fetchComments();
        // remove that comment.id from the comments array
        setComments(comments.filter(data => data.id !== comment.id));
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <RBSheet
      ref={sheetRef}
      height={height * 0.65}
      animationType="slide"
      onOpen={() => fetchComments()}
      onClose={() => setSheetState('close')}
      draggable={false}
      openDuration={400}
      closeDuration={400}
      closeOnPressMask={true}
      closeOnPressBack={true}
      closeOnOverlayTap={true}
      useNativeDriver={false}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
        draggableIcon: {
          backgroundColor: '#222',
          borderRadius: 100,
          width: 50,
          height: 5,
          paddingTop: 5,
        },
      }}
    >
      <View style={[styles.commentContainer, { backgroundColor: theme.background }]}>
        <View style={styles.modalHeader}>
          <View style={styles.commentWrapper}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Comments</Text>
            <Text style={[styles.commentsLength, { color: theme.text }]}>({comments.length})</Text>
          </View>
          <TouchableOpacity onPress={() => sheetRef?.current?.close()}>
            <Ionicons name="close" color={theme.text} size={24} />
          </TouchableOpacity>
        </View>

        {
          comments.length > 0 && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
              {
                comments.map(comment => (
                  <CommentCard key={comment?.id?.toString()} item={comment} handleDeleteComment={() => handleDeleteComment(comment)} />
                ))
              }
            </ScrollView>
          )
        }

        <View style={[styles.commentFooter, { backgroundColor: theme.background }]}>
          <TextInput
            // ref={commentInputRef}
            value={userComment}
            onChangeText={setUserComment}
            placeholderTextColor={theme.text}
            placeholder="Write a comment..."
            style={[styles.commentInput, { color: theme.text }]}
            multiline
          />
          <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.primary }]} onPress={handleSendComment}>
            <Ionicons name="arrow-up" color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </RBSheet>


    // <>
    //   <ActionSheet ref={actionSheetRef} closeOnPressBack={true} closeOnTouchBackdrop={true}>
    //     <View style={[styles.commentContainer, { backgroundColor: theme.background, height: 200 }]}>
    //       <View style={styles.modalHeader}>
    //         <View style={styles.commentWrapper}>
    //           <Text style={[styles.modalTitle, { color: theme.text }]}>Comments</Text>
    //           <Text style={[styles.commentsLength, { color: theme.text }]}>({comments.length})</Text>
    //         </View>
    //         <TouchableOpacity onPress={() => actionSheetRef.current?.close()}>
    //           <Ionicons name="close" color={theme.text} size={24} />
    //         </TouchableOpacity>
    //       </View>

    //       {
    //         comments.length > 0 && (
    //           <FlatList
    //             data={comments}
    //             renderItem={({ item }) => (
    //               <CommentCard item={item} handleDeleteComment={() => handleDeleteComment(item)} />
    //             )}
    //             keyExtractor={(item) => item.id.toString()}
    //           />
    //         )
    //       }

    //       <View style={[styles.commentFooter, { backgroundColor: theme.background }]}>
    //         <TextInput
    //           value={userComment}
    //           onChangeText={setUserComment}
    //           placeholderTextColor={theme.text}
    //           placeholder="Write a comment..."
    //           style={[styles.commentInput, { color: theme.text }]}
    //           multiline
    //         />
    //         <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.primary }]} onPress={handleSendComment}>
    //           <Ionicons name="arrow-up" color="#fff" size={20} />
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </ActionSheet>
    // </>




















  )
}

export default CommentSheet;

const styles = StyleSheet.create({
  commentContainer: {
    flex: 1,
    position: 'relative',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10
  },
  commentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
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
    backgroundColor: '#222',
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
    zIndex: 9999999999
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  }
})