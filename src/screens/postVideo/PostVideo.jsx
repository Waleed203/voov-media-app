import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Keyboard, StatusBar, BackHandler} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import useGlobalFunctions from "../../services/GlobalService";
import {APP_CONSTANTS} from "../../config/constants";
import useAPIService from "../../services/APIService";
import {createThumbnail} from "react-native-create-thumbnail";
import {SafeAreaView} from "react-native-safe-area-context";
import {useTheme} from "../../context/ThemeContext";

const PostVideo = ({navigation, route}) => {
    const {videoUri} = route.params;
    const [description, setDescription] = useState('');
    const [videoType, setVideoType] = useState('shorts');
    const {get, showToast} = useGlobalFunctions();
    const {uploadVideo, sendRequest, uploadThumbnail} = useAPIService();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const {theme} = useTheme();
    const isLoadingRef = useRef(isLoading);

    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    useEffect(() => {
        const onBackPress = () => {
            if (isLoadingRef.current) showToast('Posting... Please Wait!');
            else navigation.popTo("VideoPreview", {videoUri});
            return true;
        };
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove();
    }, [navigation]);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
            if (token) setIsLoggedIn(true);
        }
        checkLoginStatus();
    }, []);

    const handlePost = async () => {
        Keyboard.dismiss();
        if (!isLoggedIn) return showToast("Please Login to Post Video.")
        if (!description.trim()) return setErrors({description: "Please Add a Caption for Your Video."});
        setIsLoading(true);
        const id = await uploadVideoToDb();
        const formData = {video_title: 'Video', video_description: description, video_type: videoType, id};
        console.log('Posting video with data:', formData);
        const confirmPost = await sendRequest('app_video_detail', formData, "POST", true);
        console.info("Confirm Post Response:", confirmPost);
        setIsLoading(false);
        if (confirmPost.data.message === 'Success') {
            setDescription(null);
            navigation.reset({
                index: 0,
                routes: [{name: 'Tabs', state: {routes: [{name: 'Home'}]}}]
            });
        }
    };

    const uploadVideoToDb = async () => {
        const uploadVideoData = await uploadVideo(videoUri, 'appVideos', true, (progress) => {
            console.log(`Current Progress: ${progress}%`);
        });
        console.info('Uploading video', uploadVideoData);
        const id = uploadVideoData.data.data[0].id;
        await generateThumbnail(uploadVideoData.data.data[0].id, uploadVideoData.data.data[0].video_link);
        return id;
    }

    const generateThumbnail = async (videoId, videoUri) => {
        try {
            console.info("Received Props", videoId, videoUri);
            const thumbnail = await createThumbnail({url: videoUri, timeStamp: 1000});
            console.info('Generated thumbnail', thumbnail);
            const uploadThumbnailRes = await uploadThumbnail(thumbnail.path, 'thumbnail', true, videoId);
            console.info('Uploaded thumbnail', uploadThumbnailRes);
        } catch (err) {
            console.error('Error generating thumbnail:', err);
            showToast('Failed to generate thumbnail');
        }
    }

    const handleBackPress = () => {
        if (isLoadingRef.current) return showToast('Posting... Please Wait!');
        navigation.popTo("VideoPreview", {videoUri});
    }
    const styles = {
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            height: 56,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            justifyContent: 'space-between',
        },
        content: {
            padding: 16,
        },
        descriptionRow: {
            flexDirection: 'row',
            marginBottom: 10,
            alignItems: "baseline",
        },
        descriptionInput: {
            flex: 1,
            fontSize: 16,
            color: theme.text,
            paddingRight: 10,
            maxHeight: 230
        },
        coverPreview: {
            width: 160,
            height: 230,
            backgroundColor: theme.cardbg,
            borderRadius: 12,
            justifyContent: 'space-between',
            padding: 8,
        },
        thumbnailContainer: {
            borderRadius: 12,
            overflow: 'hidden',
        },
        video: {
            width: '100%',
            height: 170,
            borderRadius: 12,
        },
        previewText: {
            color: theme.text,
            fontWeight: '500',
        },
        editCoverText: {
            color: theme.text,
            fontSize: 12,
        },
        tagsRow: {
            flexDirection: 'row',
            gap: 10,
            marginBottom: 20,
        },
        tagButton: {
            backgroundColor: theme.cardbg,
            borderRadius: 8,
            paddingVertical: 6,
            paddingHorizontal: 12,
        },
        tagText: {
            color: theme.text,
            fontWeight: '500',
        },
        optionRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        optionText: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.text,
        },
        optionSubText: {
            fontSize: 12,
            color: '#888',
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 12,
            borderTopWidth: 1,
            borderColor: theme.borderColor,
            backgroundColor: theme.background,
        },
        draftButton: {
            flex: 1,
            backgroundColor: theme.cardbg,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
            paddingVertical: 12,
            marginRight: 10,
        },
        postButton: {
            flex: 1,
            backgroundColor: theme.primary,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
            paddingVertical: 12,
        },
        draftText: {
            fontWeight: '600',
            color: theme.text,
        },
        postText: {
            fontWeight: '600',
            color: '#fff',
        },
        error: {
            color: "red",
            marginTop: -8,
            fontWeight: '500',
        },
        videoTypeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        videoTypeButton: {
            flex: 1,
            borderWidth: 1,
            borderColor: '#444',
            paddingVertical: 12,
            borderRadius: 8,
            marginHorizontal: 5,
            alignItems: 'center',
        },
        videoTypeButtonSelected: {
            backgroundColor: theme.primary,
            // borderColor: '#ff2d55',
        },
        videoTypeText: {
            color: theme.text,
            fontWeight: '600',
        },
        videoTypeTextSelected: {
            color: '#fff',
        },
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={theme.mode === 'light' ? '#fff' : '#121221'} barStyle={theme.mode === 'light' ? 'dark-content' : 'light-content'}/>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress}>
                        <Ionicons name="chevron-back" size={28} color="white"/>
                    </TouchableOpacity>
                    <View style={{width: 28}}/>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* Description + Preview */}
                    <View style={styles.descriptionRow}>
                        <TextInput
                            placeholder="Add description..." placeholderTextColor="#888" style={styles.descriptionInput}
                            multiline value={description} onChangeText={setDescription}/>

                        <TouchableOpacity style={styles.coverPreview}>
                            <Text style={styles.previewText}>Preview</Text>
                            <View style={styles.thumbnailContainer}>
                                <Video source={{uri: videoUri}} style={styles.video} paused resizeMode="cover"/>
                            </View>
                            <Text style={styles.editCoverText}>Edit cover</Text>
                        </TouchableOpacity>
                    </View>
                    {errors.description && <Text style={styles.error}>{errors.description}</Text>}

                    {/*/!* Tags *!/*/}
                    {/*<View style={styles.tagsRow}>*/}
                    {/*    <TouchableOpacity style={styles.tagButton}>*/}
                    {/*        <Text style={styles.tagText}># Hashtags</Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*    <TouchableOpacity style={styles.tagButton}>*/}
                    {/*        <Text style={styles.tagText}>@ Mention</Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}

                    {/*/!* Location *!/*/}
                    {/*<TouchableOpacity style={styles.optionRow}>*/}
                    {/*    <Ionicons name="location-sharp" size={20} color="#000"/>*/}
                    {/*    <Text style={styles.optionText}>Location</Text>*/}
                    {/*</TouchableOpacity>*/}

                    {/*/!* Add Link *!/*/}
                    {/*<TouchableOpacity style={styles.optionRow}>*/}
                    {/*    <Ionicons name="link-outline" size={20} color="#f33"/>*/}
                    {/*    <Text style={styles.optionText}>Add link</Text>*/}
                    {/*</TouchableOpacity>*/}

                    {/*/!* Visibility *!/*/}
                    {/*<TouchableOpacity style={styles.optionRow}>*/}
                    {/*    <Ionicons name="earth-outline" size={20} color="#000"/>*/}
                    {/*    <Text style={styles.optionText}>Everyone can view this post</Text>*/}
                    {/*</TouchableOpacity>*/}

                    {/*/!* More Options *!/*/}
                    {/*<TouchableOpacity style={styles.optionRow}>*/}
                    {/*    <Ionicons name="ellipsis-horizontal" size={20} color="#000"/>*/}
                    {/*    <View>*/}
                    {/*        <Text style={styles.optionText}>More options</Text>*/}
                    {/*        <Text style={styles.optionSubText}>*/}
                    {/*            Privacy and more settings have been moved here.*/}
                    {/*        </Text>*/}
                    {/*    </View>*/}
                    {/*</TouchableOpacity>*/}
                    {/* Video Type Selection */}
                    <View style={styles.videoTypeContainer}>
                        {["shorts", "long"].map((type) => (
                            <TouchableOpacity key={type} style={[styles.videoTypeButton, videoType === type && styles.videoTypeButtonSelected]}
                                // onPress={() => setVideoType(type)}
                            >
                                <Text
                                    style={[styles.videoTypeText, videoType === type && styles.videoTypeTextSelected,]}>
                                    {type === "shorts" ? 'Short Video' : 'Long Video'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.draftButton}>
                        <Ionicons name="document-text-outline" size={16} color="gray"/>
                        <Text style={styles.draftText}>Drafts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postButton} onPress={handlePost} disabled={isLoading}>
                        <Ionicons name="sparkles-outline" size={16} color="#fff"/>
                        {isLoading ? <ActivityIndicator color={"white"}/> : <Text style={styles.postText}>Post</Text>}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default PostVideo;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#000',
//     },
//     header: {
//         height: 56,
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         justifyContent: 'space-between',
//     },
//     content: {
//         padding: 16,
//     },
//     descriptionRow: {
//         flexDirection: 'row',
//         marginBottom: 40,
//     },
//     descriptionInput: {
//         flex: 1,
//         fontSize: 16,
//         color: '#fff',
//         paddingRight: 10,
//     },
//     coverPreview: {
//         width: 160,
//         height: 230,
//         backgroundColor: '#111',
//         borderRadius: 12,
//         justifyContent: 'space-between',
//         padding: 8,
//     },
//     thumbnailContainer: {
//         borderRadius: 12,
//         overflow: 'hidden',
//     },
//     video: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 12,
//     },
//     previewText: {
//         color: '#fff',
//         fontWeight: '500',
//     },
//     editCoverButton: {
//         backgroundColor: '#000',
//         paddingVertical: 4,
//         alignItems: 'center',
//         borderRadius: 4,
//     },
//     editCoverText: {
//         color: '#fff',
//         fontSize: 12,
//     },
//     tagsRow: {
//         flexDirection: 'row',
//         gap: 10,
//         marginBottom: 20,
//     },
//     tagButton: {
//         backgroundColor: '#222',
//         borderRadius: 8,
//         paddingVertical: 6,
//         paddingHorizontal: 12,
//     },
//     tagText: {
//         color: '#fff',
//         fontWeight: '500',
//     },
//     optionRow: {
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         gap: 12,
//         paddingVertical: 14,
//         borderBottomWidth: 1,
//         borderBottomColor: '#222',
//     },
//     optionText: {
//         fontSize: 16,
//         fontWeight: '500',
//         color: '#fff',
//     },
//     optionSubText: {
//         fontSize: 12,
//         color: '#888',
//     },
//     footer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         padding: 12,
//         borderTopWidth: 1,
//         borderColor: '#222',
//         backgroundColor: '#000',
//     },
//     draftButton: {
//         flex: 1,
//         backgroundColor: '#222',
//         borderRadius: 8,
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         gap: 6,
//         paddingVertical: 12,
//         marginRight: 10,
//     },
//     postButton: {
//         flex: 1,
//         backgroundColor: '#ff2d55',
//         borderRadius: 8,
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         gap: 6,
//         paddingVertical: 12,
//     },
//     draftText: {
//         fontWeight: '600',
//         color: '#fff',
//     },
//     postText: {
//         fontWeight: '600',
//         color: '#fff',
//     },
//     error: {
//         color: "red",
//         marginTop: -8,
//         fontWeight: 500
//     },
// });
//
