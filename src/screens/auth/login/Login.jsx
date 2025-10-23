import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from './styles';
import useGlobalFunctions from '../../../services/GlobalService';
import useAPIService from '../../../services/APIService';
import { APP_CONSTANTS } from '../../../config/constants';
import messaging from '@react-native-firebase/messaging';

// import {
//   statusCodes,
//   isErrorWithCode,
//   isSuccessResponse,
//   GoogleSignin,
//   GoogleSigninButton,
// } from '@react-native-google-signin/google-signin';

const Login = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { showToast, set, get } = useGlobalFunctions();
  const { sendRequest } = useAPIService();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const showback = route?.params?.showback;
  const cameFrom = route?.params?.camefrom;

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const token = await get(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
      if (token) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
      }
    };
    checkIfLoggedIn();
  }, [])


  const requestNotificationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          console.log('FCM Token:', fcmToken);
          return fcmToken;
        }
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('Permission denied with Don\'t ask again');
        Alert.alert(
          'Permission Required',
          'Please enable notification permissions in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
      } else {
        console.log('Notification permission denied');
      }

      return null; // in case permission denied or token not retrieved
    } catch (err) {
      console.warn(err);
      return null;
    }
  };

  const updateProfile = async (userRes, token) => {
    const update = await sendRequest('profile_update', { fcm_token: token }, 'POST', true);
    console.log('fcm update = ', update);
    if (update.data.status) { }
  };

  const handleLogin = async () => {
    if (!user.email) {
      showToast('Please enter your email!');
      return;
    }
    if (!user.password) {
      showToast('Please enter your password!');
      return;
    }

    setLoading(true);

    try {
      const response = await sendRequest('userAuthentication', user, 'POST', false);
      const userRes = response.data;
      console.log('user response = ', userRes)

      if (userRes.status) {
        await set(APP_CONSTANTS.STORAGE_KEYS.TOKEN, userRes.token);
        await set(APP_CONSTANTS.STORAGE_KEYS.UID, userRes.data.userId);
        await set(APP_CONSTANTS.STORAGE_KEYS.USER_DATA, userRes.data, 'object');


        const token = await requestNotificationPermission();
        if (token) {
          console.log('token in login = ', token);
          updateProfile(userRes, token);
        } else {
          // handle denied or unavailable token
          console.log('token denied');
        }

        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
      }
    } catch (er) {
      console.log('er = ', er);
      let errorMessage = er.error;
      if (er.status == 400) {
        showToast(errorMessage.message);
        return;
      }

      if (er.error.status == false) {
        showToast(errorMessage.message);
        return;
      }


    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    // Implement Facebook login
  };

  const handleGoogleLogin = async () => {

    // try {
    //   console.log('logging in');
    //   setGoogleLoading(true)

    //   await GoogleSignin.hasPlayServices();
    //   const response = await GoogleSignin.signIn();
    //   if (isSuccessResponse(response)) {

    //     console.log(response.data);
    //     const userFromDB = response.data?.user;

    //     let user = {
    //       firstName: userFromDB.givenName,
    //       lastName: userFromDB.familyName,
    //       email: userFromDB.email,
    //       refrenceId: userFromDB.id,
    //       profileImage: userFromDB.photo
    //     };

    //     console.log('payload user = ', user, 'saveUserSoial');
    //     const data = await sendRequest('saveUserSoial', user, 'POST', false);
    //     console.log('after login :', data);

    //     if (data.success) {
    //       setGoogleLoading(false);

    //       await set(APP_CONSTANTS.STORAGE_KEYS.TOKEN, data.data.token);
    //       await set(APP_CONSTANTS.STORAGE_KEYS.UID, data.data.data.userId);
    //       await set(APP_CONSTANTS.STORAGE_KEYS.USER_DATA, data.data.data, 'object');

    //       const token = await requestNotificationPermission();
    //       if (token) {
    //         console.log('token in login = ', token);
    //         updateProfile(data.data, token);
    //       } else {
    //         // handle denied or unavailable token
    //         console.log('token denied');
    //       }

    //       navigation.reset({
    //         index: 0,
    //         routes: [{ name: 'Tabs' }],
    //       });
    //     }
    //   } else {
    //     setGoogleLoading(false);
    //     showToast('Login failed');
    //     console.log('Login failed', data);
    //   }
    // } catch (error) {
    //   console.log(error);
    //   setGoogleLoading(false);
    //   if (isErrorWithCode(error)) {
    //     switch (error.code) {
    //       case statusCodes.ONE_TAP_START_FAILED:
    //         break;
    //       case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
    //         break;
    //       default:
    //     }
    //   } else {
    //   }
    // }
  };

  const CustomCheckbox = ({ value, onValueChange }) => (
    <TouchableOpacity
      style={[
        styles.checkbox,
        value && styles.checkboxChecked
      ]}
      onPress={() => onValueChange(!value)}
    >
      {value && <Ionicons name="checkmark" size={16} color="#fff" />}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/images/app-background.jpg')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        {showback && (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        <View style={styles.wrapper}>
          <View style={styles.logoDiv}>
            <Image
              source={require('../../../assets/icon/logo.jpg')}
              style={styles.logo}
            />
          </View>



          <View style={styles.signDiv}>
            {/* <Text style={styles.signLabel}>Sign In</Text> */}
          </View>


          <View style={styles.form}>
            <View style={styles.field}>
              <AntDesign name="mail" size={14} color="#fff" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#fff"
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.field}>
              <Ionicons name="lock-closed-outline" size={20} color="#fff" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#fff"
                value={user.password}
                onChangeText={(text) => setUser({ ...user, password: text })}
                secureTextEntry
              />
            </View>

            <View style={styles.forgotPass}>
              <View style={styles.remember}>
                <CustomCheckbox
                  value={rememberMe}
                  onValueChange={setRememberMe}
                />
                <Text style={styles.rememberText}>Remember Me</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {
              loading ?
                <View style={styles.button}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
                :
                (
                  <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Sign In</Text>
                  </TouchableOpacity>
                )
            }


            <TouchableOpacity
              style={styles.signup}
              onPress={() => navigation.navigate('SignupOptions')}
            >
              <Text style={styles.signupText}>Still not connected?</Text>
              <Text style={[styles.signupText, styles.signupLink]}> Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.orSection}>
              <View style={styles.dash} />
              <View style={styles.orCircle}>
                <Text style={styles.orText}>OR</Text>
              </View>
              <View style={styles.dash} />
            </View>

            {/* <TouchableOpacity
              style={[styles.socialButton, styles.facebookButton]}
              onPress={handleFacebookLogin}
            >
              <Ionicons name="logo-facebook" size={20} color="#1c39a1" />
              <Text style={[styles.socialButtonText, styles.fbText]}>
                Sign Up With Facebook
              </Text>
            </TouchableOpacity> */}

            {/* {
              googleLoading ?
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                >
                  <ActivityIndicator size="small" color="#d95946" />
                </TouchableOpacity>
                :
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={handleGoogleLogin}
                >
                  <Ionicons name="logo-google" size={20} color="#d95946" />
                  <Text style={[styles.socialButtonText, styles.googleText]}>
                    Sign Up with Google
                  </Text>
                </TouchableOpacity>
            } */}

          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Login;