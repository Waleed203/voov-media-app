import { useCallback, useEffect, useState } from 'react'
import { Linking, StyleSheet, View, Text, Image, Platform } from 'react-native'
import { Camera } from 'react-native-vision-camera'
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets'

const BANNER_IMAGE = require("../../../assets/images/themelight.png");
const CONTENT_SPACING = 15
const SAFE_BOTTOM = Platform.select({ ios: StaticSafeAreaInsets.safeAreaInsetsBottom }) ?? 0
export const SAFE_AREA_PADDING = {
    paddingLeft: StaticSafeAreaInsets.safeAreaInsetsLeft + CONTENT_SPACING,
    paddingTop: StaticSafeAreaInsets.safeAreaInsetsTop + CONTENT_SPACING,
    paddingRight: StaticSafeAreaInsets.safeAreaInsetsRight + CONTENT_SPACING,
    paddingBottom: SAFE_BOTTOM + CONTENT_SPACING,
}

export default function PermissionsPage({ navigation }) {
    const [cameraPermissionStatus, setCameraPermissionStatus] = useState('not-determined')
    const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState('not-determined')

    const requestMicrophonePermission = useCallback(async () => {
        console.log('Requesting microphone permission...')
        const permission = await Camera.requestMicrophonePermission()
        console.log(`Microphone permission status: ${permission}`)

        if (permission === 'denied') await Linking.openSettings()
        setMicrophonePermissionStatus(permission)
    }, [])

    const requestCameraPermission = useCallback(async () => {
        console.log('Requesting camera permission...')
        const permission = await Camera.requestCameraPermission()
        console.log(`Camera permission status: ${permission}`)

        if (permission === 'denied') await Linking.openSettings()
        setCameraPermissionStatus(permission)
    }, [])

    useEffect(() => {
        if (cameraPermissionStatus === 'granted' && microphonePermissionStatus === 'granted') {
            navigation.replace('CameraRecorder')
        }
    }, [cameraPermissionStatus, microphonePermissionStatus, navigation])

    return (
        <View style={styles.container}>
            <Image source={BANNER_IMAGE} style={styles.banner} />
            <Text style={styles.welcome}>Welcome to{'\n'}Voov Media.</Text>
            <View style={styles.permissionsContainer}>

                {cameraPermissionStatus !== 'granted' && (
                    <Text style={styles.permissionText}>
                        Camera needs <Text style={styles.bold}>Camera permission</Text>.{' '}
                        <Text style={styles.hyperlink} onPress={requestCameraPermission}>{"\n"}Grant Now?</Text>
                    </Text>)}

                {microphonePermissionStatus !== 'granted' && (
                    <Text style={styles.permissionText}>
                        Camera needs <Text style={styles.bold}>Microphone permission</Text>.{' '}
                        <Text style={styles.hyperlink} onPress={requestMicrophonePermission}>{"\n"}Grant Now?</Text>
                    </Text>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    welcome: {
        fontSize: 38,
        fontWeight: 'bold',
        maxWidth: '80%',
    },
    banner: {
        position: 'absolute',
        opacity: 0.4,
        bottom: 0,
        alignSelf: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#E5E5EA',
        ...SAFE_AREA_PADDING,
    },
    permissionsContainer: {
        marginTop: CONTENT_SPACING * 2,
    },
    permissionText: {
        fontSize: 19,
    },
    hyperlink: {
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'blue',
        fontSize: 25,
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 19,
    },
})
