import React, {useEffect} from "react";
import {View, Text, Image, TouchableOpacity, StyleSheet, Pressable} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from "react-native-video";
import FastImage from "@d11/react-native-fast-image";
import config from "../../../config/config";
import moment from "moment";
import {useTheme} from "../../../context/ThemeContext";

const VideoGrid = ({video, index, handleEdit, handleDelete, openVideo, mode}) => {
    const theme = useTheme();

    useEffect(() => {
        console.log('video grid reloaded', mode)
    }, []);

    return (
        <View style={mode !== 'studio' ? {...styles.container, width: '33%', padding: 5} : styles.container}>
            <View style={styles.card}>
                <Pressable onPress={() => openVideo(video, index, mode)}>
                    {
                        <FastImage source={{uri: video.video_thumbnail, headers: {}, priority: FastImage.priority.normal}}
                                   resizeMode={FastImage.resizeMode.cover}
                                   style={styles.thumbnail}
                        />
                    }
                </Pressable>


                {/* Edit & Delete Buttons */}
                {
                    mode == "user" &&
                    <>
                        <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(video)}>
                            <Ionicons name="create-outline" size={20} color="white"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(video.id, index)}>
                            <Ionicons name="close-circle" size={24} color="white"/>
                        </TouchableOpacity>
                    </>
                }

                {
                    mode != 'studio' && <View style={styles.viewCount}>
                        <Ionicons name="play-outline" size={12} color="white"/>
                        <Text style={styles.viewText}>{video.clicked_views}</Text>
                    </View>
                }
            </View>

            {/*{mode == 'search' && <View style={styles.profileContainer}>*/}
            {/*        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>*/}
            {/*            <FastImage source={{uri: config.profileImage + video.user_detail.profileImage}} style={styles.profileImage}/>*/}
            {/*            <View style={styles.userNameContainer}>*/}
            {/*                <Text style={styles.userName}>{video.user_detail.firstName}</Text>*/}
            {/*                /!* <Text style={[styles.desc, { color: theme.mode === 'light' ? '#000' : '#fff' }]} numberOfLines={2}>{video.video_description}</Text> *!/*/}
            {/*            </View>*/}
            {/*        </View>*/}

            {/*        <View style={styles.info}>*/}
            {/*            <Text style={[styles.subText, {color: theme.mode === 'light' ? '#000' : '#fff'}]}>{video.unique_views} views • {video.impressions} impressions</Text>*/}
            {/*            <Text style={[styles.subText, {color: theme.mode === 'light' ? '#000' : '#fff'}]}>Revenue: $ {video.revenue_usd}</Text>*/}
            {/*        </View>*/}
            {/*    </View>}*/}


            {
                mode == 'studio' && <View style={styles.profileContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                        <View style={styles.userNameContainer}>
                            <Text style={[styles.subText, {color: theme.mode === 'light' ? '#000' : '#fff'}]}>{video.unique_views} views • {video.impressions} impressions</Text>
                        </View>
                    </View>
                </View>
            }

            {
                mode == 'studio' && <View style={[{position: 'absolute', bottom: 30, left: 15}]}>
                    <View style={styles.info}>
                        <Text style={[styles.subText, {color: theme.mode === 'light' ? '#000' : '#fff'}]}>Revenue: $ {video.revenue_usd}</Text>
                    </View>
                </View>
            }


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: "50%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
    },
    card: {
        width: "100%",
        aspectRatio: 9 / 16,
        position: "relative",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#222",
    },
    thumbnail: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    editBtn: {
        position: "absolute",
        top: 5,
        left: 5,
        // backgroundColor: "rgba(0, 0, 0, 0.6)",
        // padding: 5,
        borderRadius: 15,
    },
    deleteBtn: {
        position: "absolute",
        top: 5,
        right: 5,
        // backgroundColor: "rgba(0, 0, 0, 0.6)",
        // padding: 5,
        borderRadius: 15,
    },
    viewCount: {
        position: "absolute",
        bottom: 5,
        right: 5,
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: 5,
        borderRadius: 10,
    },
    viewText: {
        fontSize: 12,
        color: "#fff",
        marginLeft: 3,
    },
    profileContainer: {
        position: "absolute",
        top: 15,
        left: 15,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginTop: 10,
        // width: "100%",
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 5,
        borderRadius: 10,
    },
    profileImage: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 6,
    },
    userNameContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        // width: "100%",
    },
    userName: {
        fontSize: 10,
        color: "#fff",
    },
    info: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 5,
        borderRadius: 10,
    },

    desc: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 2,
        textAlign: 'left',
    },

    subText: {
        fontSize: 11,
        color: '#ccc',
        textAlign: 'left',
    },

    date: {
        fontSize: 10,
        color: '#aaa',
        textAlign: 'left',
        marginTop: 2,
    },
});

export default VideoGrid;