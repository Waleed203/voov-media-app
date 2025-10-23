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
import useAPIService from '../../../services/APIService';
import { styles } from './styles';
import useGlobalFunctions from '../../../services/GlobalService';
import { APP_CONSTANTS } from '../../../config/constants';

const Signup = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { showToast, set } = useGlobalFunctions();
  const { sendRequest } = useAPIService();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const showback = route?.params?.showback;
  const cameFrom = route?.params?.camefrom;

  // const goBack = () => {
  //   if (cameFrom === 'logout') {
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'Home' }],
  //     });
  //   } else {
  //     navigation.goBack();
  //   }
  // };

  const handleSignUp = async () => {
    if (!user.firstName.trim()) {
      showToast('Please enter your first name!');
      return;
    }
    if (!user.lastName.trim()) {
      showToast('Please enter your last name!');
      return;
    }
    if (!user.email.trim()) {
      showToast('Please enter your email!');
      return;
    }
    if (!user.password) {
      showToast('Please enter your password!');
      return;
    }
    if (!rememberMe) {
      showToast('Please agree to Terms & Services!');
      return;
    }

    setLoading(true)
    try {
      const response = await sendRequest(
        'registerUser',
        {
          firstName: user.firstName.trim(),
          lastName: user.lastName.trim(),
          email: user.email.trim().toLowerCase(),
          password: user.password,
          profileImage: '',
        },
        'POST',
        false
      );

      if (response.data) {
        showToast('Registration successful!');
        loginNow();
      }
    } catch (error) {
      console.log('error = ', error.response?.data);
      showToast(error.response?.data?.message || 'Registration failed!');
      setLoading(false);
    }
  };

  const loginNow = async () => {
    try {
      const response = await sendRequest('userAuthentication', { email: user.email.trim().toLowerCase(), password: user.password }, 'POST', false);
      const userRes = response.data;
      console.log('user response = ', userRes)

      if (userRes.status) {
        await set(APP_CONSTANTS.STORAGE_KEYS.TOKEN, userRes.token);
        await set(APP_CONSTANTS.STORAGE_KEYS.UID, userRes.data.userId);
        await set(APP_CONSTANTS.STORAGE_KEYS.USER_DATA, userRes.data, 'object');
        setLoading(false)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
      }
    } catch (er) {
      console.log('er = ', er);
      setLoading(false)
      let errorMessage = er.error;
      if (er.status == 400) {
        showToast(errorMessage.message);
      }
    }
  }

  const handleFacebookLogin = async () => {
    // Implement Facebook login
  };

  const handleGoogleLogin = async () => {
    // Implement Google login
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
            {/* <Text style={styles.signLabel}>Sign Up</Text> */}
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Ionicons name="person-outline" size={14} color="#fff" />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#fff"
                value={user.firstName}
                onChangeText={(text) => setUser({ ...user, firstName: text })}
                keyboardType="default"
              />
            </View>

            <View style={styles.field}>
              <Ionicons name="person-outline" size={14} color="#fff" />
              <TextInput
                style={styles.input}
                placeholder="last Name"
                placeholderTextColor="#fff"
                value={user.lastName}
                onChangeText={(text) => setUser({ ...user, lastName: text })}
                keyboardType="default"
              />
            </View>
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
                <Text style={styles.rememberText}>Agree to Terms & Services</Text>
              </View>
            </View>

            {!loading ? (
              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.button}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            )}

            <TouchableOpacity
              style={styles.signup}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.signupText}>Already have an account?</Text>
              <Text style={[styles.signupText, styles.signupLink]}> Sign In</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Signup;