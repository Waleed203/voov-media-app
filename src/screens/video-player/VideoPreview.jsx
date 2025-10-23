import React, {useRef, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform} from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

export default function VideoPreview({navigation, route}) {
    const {videoUri} = route.params;
    const videoRef = useRef(null);
    const [paused, setPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(true);

    // useEffect(() => {
    //     let timeout;
    //     if (showControls && !paused) timeout = setTimeout(() => setShowControls(false), 3000);
    //     return () => clearTimeout(timeout);
    // }, [showControls, paused]);

    const onLoad = (data) => setDuration(data.duration);
    const onProgress = (data) => setCurrentTime(data.currentTime);

    const onSeek = (time) => {
        videoRef.current?.seek(time);
        setCurrentTime(time);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const togglePlayPause = () => setPaused(!paused);
    const handleTap = () => setShowControls(!showControls);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#000"/>
            <View style={styles.inner}>
                <TouchableOpacity style={styles.defaultVideoContainer} activeOpacity={1} onPress={handleTap}>
                    <Video ref={videoRef} source={{uri: videoUri}} style={StyleSheet.absoluteFill} resizeMode="contain"
                           paused={paused} onLoad={onLoad} onProgress={onProgress}/>

                    {showControls && (<>
                        <TouchableOpacity style={styles.centerControl} onPress={togglePlayPause}>
                            <Ionicons name={paused ? 'play-circle' : 'pause-circle'} size={64} color="#fff"/>
                        </TouchableOpacity>

                        <View style={styles.controls}>
                            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                            <Slider style={styles.slider} value={currentTime} minimumValue={0} maximumValue={duration} onSlidingComplete={onSeek}
                                    minimumTrackTintColor="#47c2f0" maximumTrackTintColor="#888" thumbTintColor="#47c2f0"/>
                            <Text style={styles.timeText}>{formatTime(duration)}</Text>
                        </View>
                    </>)}
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white"/>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#f33'}]} onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonText}>Discard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#47c2f0'}]} onPress={() => {
                        setPaused(true);
                        navigation.navigate('PostVideo', {videoUri})
                    }}>
                        <Text style={styles.buttonText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    inner: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    defaultVideoContainer: {
        width: '100%',
        flex: 1,
        backgroundColor: 'black',
    },
    centerControl: {
        position: 'absolute',
        alignSelf: 'center',
        top: '45%',
        zIndex: 10,
    },
    controls: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        width: '100%',
    },
    timeText: {
        color: 'white',
        fontSize: 12,
        width: 40,
        textAlign: 'center',
    },
    slider: {
        flex: 1,
        marginHorizontal: 8,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 20,
        zIndex: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#000',
        borderTopWidth: 1,
        borderColor: '#222',
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
});
