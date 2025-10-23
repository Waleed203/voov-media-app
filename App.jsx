import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/navigation';
import MobileAds from 'react-native-google-mobile-ads';
import BootSplash from 'react-native-bootsplash';
import { SheetProvider } from './src/context/CommentSheetContext';
import CommentSheet from './src/components/CommentSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ThemeProvider } from './src/context/ThemeContext';
import messaging from '@react-native-firebase/messaging';
import { ActivityIndicator, Linking } from 'react-native';

const App = () => {
    const linking = {
        prefixes: ['voovmedia://'],
        config: {
            screens: {
                VideoPlayer: {
                    path: 'video/:videoId',
                    parse: {
                        videoId: id => id,
                    },
                },
                GuestProfile: {
                    path: 'guest/:userId',
                    parse: {
                        userId: id => id,
                    },
                },
            },
        },
    };

    useEffect(() => {
        const hideSplash = async () => {
            await BootSplash.hide({ fade: true });
            console.log('BootSplash has been hidden successfully');
        };

        hideSplash();

        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('A new FCM message arrived!', remoteMessage);
        });

        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
        });

        const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification caused app to open from background state:', remoteMessage);
            if (remoteMessage?.data?.type === 'like' || remoteMessage?.data?.type === 'comment') {
                const videoId = remoteMessage?.data?.video_id;
                if (videoId) {
                    const url = `voovmedia://video/${videoId}`;
                    Linking.openURL(url);
                }
            } else {
                const userId = remoteMessage?.data?.user_id;
                const url = `voovmedia://guest/${userId}`;
                Linking.openURL(url);
            }
        });

        const handleDeepLink = ({ url }) => {
            console.log('Received deep link:', url);
        };

        const linkingListener = Linking.addEventListener('url', handleDeepLink);

        return () => {
            unsubscribe();
            unsubscribeOpened();
            linkingListener.remove();
        };
    }, []);

    useEffect(() => {
        // GoogleSignin.configure({
        //     webClientId: '104870875531-gn7d96n6rmihbef9jgrhv7arscn60sgu.apps.googleusercontent.com',
        //     offlineAccess: true,
        //     scopes: ['profile', 'email'],
        // });

        MobileAds().initialize().then(() => {
            console.log('AdMob initialized');
        });
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <NavigationContainer linking={linking} fallback={<ActivityIndicator size="large" color="#000" />}>
                    <SheetProvider>
                        <Navigation />
                        <CommentSheet />
                    </SheetProvider>
                </NavigationContainer>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
};

export default App;
