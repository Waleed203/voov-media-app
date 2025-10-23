import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './tabs';
import Login from '../screens/auth/login/Login';
import Signup from '../screens/auth/signup/Signup';
import SignupOptions from '../screens/auth/signup-options/SignupOptions';
import ForgotPassword from '../screens/auth/forgot-password/ForgotPassword';
import ResetPassword from '../screens/auth/reset-password/ResetPassword';
import PinVerification from '../screens/auth/pin-verification/PinVerification';
import Settings from '../screens/settings/Settings';
import Videoslist from '../screens/videos-list/Videoslist';
import AddVideo from '../screens/add-video/AddVideo';
import EditProfile from '../screens/edit-profile/EditProfile';
import GuestProfile from '../screens/guest-profile/GuestProfile';
import useGlobalFunctions from '../services/GlobalService';
import { APP_CONSTANTS } from '../config/constants';
import ContactUs from '../screens/contact-us/ContactUs';
import { VideoProvider } from '../context/VideoContext';
import ImageViewerScreen from '../screens/image-viewer/ImageViewerScreen';
import { TransitionPresets } from '@react-navigation/bottom-tabs';
import Studio from '../screens/voov-studio/Studio';
import { useTheme } from '../context/ThemeContext';
import EditVideo from '../screens/edit-video/EditVideo';
import VideoPlayer from '../screens/video-player/VideoPlayer';
import Notifications from '../screens/notifications/Notifications';
import UserStats from '../screens/user-stats/UserStats';
import FeedList from '../screens/feed-list/FeedList';
import CameraRecorder from "../screens/camera-recorder/CameraRecorder";
import VideoPreview from "../screens/video-player/VideoPreview";
import PostVideo from "../screens/postVideo/PostVideo";
import PermissionsPage from "../screens/camera-recorder/components/PermissionsPage";

const Stack = createNativeStackNavigator();

const VideosListWithProvider = () => (
  <VideoProvider>
    <Videoslist />
  </VideoProvider>
);
const StudioWithProvider = () => (
  <VideoProvider>
    <Studio />
  </VideoProvider>
);

const Navigation = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator initialRouteName='Tabs' screenOptions={{
        headerShown: false,
        // animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="UserStats" component={UserStats} />
      <Stack.Screen name="FeedList" component={FeedList} />
      <Stack.Screen name="GuestProfile" component={GuestProfile} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="SignupOptions" component={SignupOptions} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="PinVerification" component={PinVerification} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Videoslist" component={VideosListWithProvider} />
      <Stack.Screen name="AddVideo" component={AddVideo} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="ImageViewer" component={ImageViewerScreen} />
      <Stack.Screen name="studio" component={StudioWithProvider} />
      <Stack.Screen name="EditVideo" component={EditVideo} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="CameraRecorder" component={CameraRecorder} />
      <Stack.Screen name="VideoPreview" component={VideoPreview} />
      <Stack.Screen name="PostVideo" component={PostVideo} />
      <Stack.Screen name="PermissionsPage" component={PermissionsPage} />
    </Stack.Navigator>
  );
};

export default Navigation;