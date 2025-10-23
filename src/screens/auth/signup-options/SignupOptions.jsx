import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from './styles';
import { APP_CONSTANTS } from '../../../config/constants';

// import {
//   statusCodes,
//   isErrorWithCode,
//   isSuccessResponse,
//   GoogleSignin,
//   GoogleSigninButton,
// } from '@react-native-google-signin/google-signin';
import useAPIService from '../../../services/APIService';
import useGlobalFunctions from '../../../services/GlobalService';

const SignupOptions = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { sendRequest } = useAPIService();
  const { set, showToast } = useGlobalFunctions();

  const handleFacebookLogin = async () => {
    // Implement Facebook login
  };

  const handleGoogleLogin = async () => {
    // try {
    //   console.log('logging in');
    //   setLoading(true)

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

    //     if (data.data.status) {
    //       setLoading(false);

    //       await set(APP_CONSTANTS.STORAGE_KEYS.TOKEN, data.data.token);
    //       await set(APP_CONSTANTS.STORAGE_KEYS.UID, data.data.data.userId);
    //       await set(APP_CONSTANTS.STORAGE_KEYS.USER_DATA, data.data.data, 'object');

    //       navigation.reset({
    //         index: 0,
    //         routes: [{ name: 'Tabs' }],
    //       });
    //     }
    //   } else {
    //     setLoading(false);
    //     showToast('Login failed');
    //     console.log('Login failed', data);
    //   }
    // } catch (error) {
    //   console.log(error);
    //   setLoading(false);
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

  return (
    <ImageBackground
      source={require('../../../assets/images/app-background.jpg')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* {showback && (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        )} */}

        <View style={styles.wrapper}>
          <View style={styles.logoDiv}>
            <Image
              source={require('../../../assets/icon/logo.jpg')}
              style={styles.logo}
            />
          </View>

          <View style={styles.form}>

            <TouchableOpacity
              style={[styles.button, styles.emailButton]}
              onPress={() => navigation.navigate('Signup')}
            >
              <Ionicons name="mail" size={16} color="#fff" />
              <Text style={[styles.buttonText]}>
                Sign Up With Email
              </Text>
            </TouchableOpacity>


            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 32 }}>
              <View style={{ flex: 1, height: 0.5, backgroundColor: 'rgb(124, 118, 118)' }} />
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
              loading ?
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

export default SignupOptions;