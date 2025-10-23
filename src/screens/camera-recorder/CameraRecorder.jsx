import { useEffect, useRef, useState } from "react";
import { Camera, useCameraDevice, useCameraFormat, useCameraPermission, useMicrophonePermission } from "react-native-vision-camera";
import { ActivityIndicator, Animated, BackHandler, Easing, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Circle } from 'react-native-svg';
import useGlobalFunctions from "../../services/GlobalService";
import { APP_CONSTANTS } from "../../config/constants";
import Popover from 'react-native-popover-view';
import NotLoggedIn from "./components/NotLoggedIn";
import { useIsFocused } from "@react-navigation/native";
import { useIsForeground } from "./components/useIsForeground";
import PermissionsPage from "./components/PermissionsPage";
import { launchImageLibrary } from "react-native-image-picker";
import AppHeader from "../../components/AppHeader";
import { useTheme } from "../../context/ThemeContext";

const radius = 40;
const circumference = 2 * Math.PI * radius;
export default function CameraRecorder({ navigation }) {
    const {theme} = useTheme();
    const camera = useRef(null);
    const intervalRef = useRef(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [cameraFacing, setCameraFacing] = useState("front");
    const device = useCameraDevice(cameraFacing);
    const [flash, setFlash] = useState("off");
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(15);
    const [timer, setTimer] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const { hasPermission: hasCameraPermission, requestPermission: requestCameraPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();
    const format = useCameraFormat(device, [{ videoAspectRatio: 16 / 9 }, { videoResolution: { width: 720, height: 1280 } }]);
    const { get, showToast } = useGlobalFunctions();
    const isRecordingRef = useRef(isRecording);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const isFocussed = useIsFocused()
    const isForeground = useIsForeground()
    const isActive = isFocussed && isForeground

    useEffect(() => {
        isRecordingRef.current = isRecording;
    }, [isRecording]);

    useEffect(() => {
        const requestPermissions = async () => {
            if (!hasCameraPermission) await requestCameraPermission();
            if (!hasMicPermission) await requestMicPermission();
        }
        requestPermissions();
    }, [hasCameraPermission, hasMicPermission]);

    useEffect(() => {
        const checkLogin = async () => {
            const token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
            setIsLoggedIn(!!token);
        };
        checkLogin();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        const onBackPress = () => {
            if (isRecordingRef.current) {
                showToast('Recording… Please finish first');
                return true;
            }
            return false;
        };
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove();
    }, [navigation]);


    const toggleFlash = () => setFlash(prev => prev === "off" ? "on" : "off");
    const toggleCamera = () => setCameraFacing(prev => prev === "front" ? "back" : "front");
    const toggleMute = () => setIsMuted(prev => !prev);

    const startTimer = () => {
        if (intervalRef.current) return;
        intervalRef.current = setInterval(() => {
            setTimer(prev => {
                const next = prev + 1;
                if (next >= duration) {
                    stopRecording();
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    return duration;
                }
                return next;
            });
        }, 1000);
    }

    const stopTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const animateButton = () => {
        Animated.loop(Animated.sequence([Animated.timing(scaleAnim, {
            toValue: 1.2, duration: 500, easing: Easing.linear, useNativeDriver: true
        }), Animated.timing(scaleAnim, {
            toValue: 1, duration: 500, easing: Easing.linear, useNativeDriver: true
        })])).start();
    }

    const startRecording = async () => {
        if (!camera.current) return;
        setIsRecording(true);
        setTimer(0);
        startTimer();
        animateButton();
        try {
            await camera.current.startRecording({
                fileType: "mp4", flash, videoCodec: "h265",
                onRecordingFinished: video => {
                    const videoUri = `file://${video.path}`;
                    CameraRoll.saveAsset(videoUri, { type: "video" });
                    navigation.navigate("VideoPreview", { videoUri });
                },
                onRecordingError: error => console.log("Recording Error", error),
            });
        } catch (err) {
            console.error("Cannot Start Recording", err);
        }
    }

    const stopRecording = async () => {
        try {
            if (camera.current) await camera.current.stopRecording();
        } catch (err) {
            console.error("Stop Recording Error: ", err);
        } finally {
            stopTimer();
            setIsRecording(false);
            setIsPaused(false);
            setTimer(0);
        }
    }

    const pauseRecording = async () => {
        try {
            if (camera.current) await camera.current.pauseRecording();
            setIsPaused(true);
            stopTimer();
        } catch (err) {
            console.error("Pause Recording Error", err);
        }
    }

    const resumeRecording = async () => {
        try {
            if (camera.current) await camera.current.resumeRecording();
            setIsPaused(false);
            startTimer();
        } catch (err) {
            console.error("Resume Recording Error", err);
        }
    }

    const cancelRecording = async () => {
        try {
            if (camera.current) await camera.current.cancelRecording();
        } catch (err) {
            console.error("Cancel recording recording", err);
        } finally {
            stopTimer();
            setIsRecording(false);
            setIsPaused(false);
            setTimer(0);
        }
    }

    const startOverRecording = async () => {
        await cancelRecording();
        setTimeout(() => {
            startRecording();
        }, 500);
    };

    const handleRecordButtonPress = async () => {
        if (isPaused) await resumeRecording();
        else if (isRecording) await pauseRecording();
        else await startRecording();
    }

    const pickVideo = async () => {
        const options = { mediaType: 'video', videoQuality: 'high' };

        await launchImageLibrary(options, async (response) => {
            if (response.assets && response.assets[0]?.uri) {
                const videoUri = response.assets[0].uri;
                navigation.navigate("VideoPreview", { videoUri });

            }
        });
    };

    if (!device) return <ActivityIndicator size={"large"} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#000' }} />

    if (!isLoggedIn) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.background, padding: 10, }}>
                <AppHeader title="Upload Content" />
                <NotLoggedIn />
            </View>
        )
    }

    if (!hasCameraPermission || !hasMicPermission) return <PermissionsPage />

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#000" />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
                <Camera ref={camera} device={device} isActive={isActive} video={true} audio={!isMuted} torch={flash}
                    format={format} style={{ aspectRatio: 9 / 16, width: '100%' }} />
            </View>
            {/* Cross Icon */}
            {!isRecording && <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>}

            {isRecording && <Popover from={<TouchableOpacity style={styles.closeButton}>
                <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>}>
                <View style={styles.dropdown}>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={cancelRecording}>
                        <Ionicons name="trash-outline" size={24} color="black" />
                        <Text style={styles.dropdownItem}>Discard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={startOverRecording}>
                        <Ionicons name="refresh-outline" size={24} color="black" />
                        <Text style={styles.dropdownItem}>Start over</Text>
                    </TouchableOpacity>
                </View>
            </Popover>}

            {/*Controls on Right Side*/}
            <View style={styles.rightControls}>
                <TouchableOpacity style={styles.sideButton} onPress={toggleCamera}>
                    <Ionicons name="camera-reverse-outline" size={30} color="#fff" />
                </TouchableOpacity>
                {device.hasFlash && <TouchableOpacity style={styles.sideButton} onPress={toggleFlash}>
                    <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} size={30} color="#fff" />
                </TouchableOpacity>}
                <TouchableOpacity style={styles.sideButton} onPress={toggleMute}>
                    <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            {/*Recording Duration Selector*/}
            {!isRecording && <View style={styles.durationSelector}>
                {[15, 60].map(sec => <TouchableOpacity key={sec} onPress={() => setDuration(sec)}
                    style={[styles.durationButton, duration === sec && styles.durationActive]}>
                    <Text style={styles.durationText}>{sec}s</Text>
                </TouchableOpacity>)}
            </View>}

            {/*Recording & Gallery Button*/}
            <View style={styles.bottomControls}>
                {/*Record Button With Progress Ring*/}
                <View style={styles.recordWrapper}>
                    <Svg width={90} height={90}>
                        <Circle cx={45} cy={45} r={radius} stroke="#fff" strokeWidth={4} fill="none" opacity={0.2} />
                        <Circle cx={45} cy={45} r={radius} stroke="#ff2d55" strokeWidth={4} fill="none"
                            strokeDasharray={`${circumference}, ${circumference}`}
                            strokeDashoffset={circumference - (timer / duration) * circumference}
                            strokeLinecap="round" transform="rotate(-90 45 45)" />
                    </Svg>
                    {/* <Animated.View style={[styles.absoluteCenter, { transform: [{ scale: scaleAnim }] }]}> */}
                    <View style={[styles.absoluteCenter]}>
                        {
                            isRecording && !isPaused ?
                            <TouchableOpacity style={[styles.innerRecordButton, { justifyContent: 'center', alignItems: 'center' }]} onPress={handleRecordButtonPress}>
                                <Ionicons name="stop" size={24} color="#fff" />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.innerRecordButton} onPress={handleRecordButtonPress} />
                        }
                    </View>
                </View>

                {/*Gallery Button / Done Recording Button*/}
                {!isRecording ?
                    <TouchableOpacity style={styles.galleryButton} onPress={pickVideo}>
                        <Ionicons name="images" size={30} color={theme.text} />
                    </TouchableOpacity> :
                    <TouchableOpacity style={styles.doneButton} onPress={stopRecording}>
                        <Ionicons name="checkmark-circle" size={48} color="green" />
                    </TouchableOpacity>}
            </View>

            {/*Recording Timer Above Record Button*/}
            {isRecording && <View style={styles.recordingTimerWrapper}>
                <Text style={styles.recordingTimerText}>{timer}s</Text>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        left: 16,
        // backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 10,
        zIndex: 10,
    },
    rightControls: {
        position: 'absolute',
        right: 20,
        top: 20,
        alignItems: 'center',
    },
    sideButton: {
        marginBottom: 25,
        // backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 10,
        borderRadius: 25,
    },
    durationSelector: {
        position: 'absolute',
        bottom: 160,
        alignSelf: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    durationButton: {
        marginHorizontal: 12,
    },
    durationActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
    },
    durationText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    bottomControls: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 90,
        height: 90,
    },
    innerRecordButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ff2d55',
    },
    galleryButton: {
        position: 'absolute',
        right: 40,
        bottom: 30,
    },
    doneButton: {
        position: 'absolute',
        right: 40,
        bottom: 0,
    },
    recordingTimerWrapper: {
        position: 'absolute',
        bottom: 140,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    recordingTimerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    absoluteCenter: {
        position: 'absolute',
        left: 13,
        top: 13,
    },
    dropdown: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingRight: 20,
        backgroundColor: '#fff',
        width: "auto",
        alignContent: "space-between"
    },
    dropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 5,
        fontSize: 16,
        fontWeight: "bold",
    },
})