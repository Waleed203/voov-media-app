import React, { useState } from 'react';
import { View, Text, ImageBackground, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from './styles';
import useAPIService from '../../../services/APIService';
import useGlobalFunctions from '../../../services/GlobalService';
import { APP_CONSTANTS } from '../../../config/constants';

const ForgotPassword = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const showback = route?.params?.showback;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast, set } = useGlobalFunctions();
  const { sendRequest } = useAPIService();


  const handleSendEmail = async () => {
    console.log('inside handleSendEmail')
    if (!email.trim()) {
      showToast('Please enter your email!');
      return;
    }

    setLoading(true)
    try {
      const response = await sendRequest(
        'resetPassword',
        {
          email: email.trim().toLowerCase(),
        },
        'POST',
        false
      );
      console.log('forgot = ', response);
      if (response.data) {
        showToast('Password reset email sent successfully!');
        setLoading(false);
        set(APP_CONSTANTS.STORAGE_KEYS.TOKEN_FORGOT, response.data.token, 'string')
        navigation.navigate('PinVerification', {response: response.data});
      }
    } catch (error) {
      console.log('error = ', error.response?.data);
      showToast(error.response?.data?.message || 'Registration failed!');
      setLoading(false);
    }
  }

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
            <Text style={styles.signLabel}>Forgot Password</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <AntDesign name="mail" size={14} color="#fff" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#fff"
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
              />
            </View>

            {!loading ? (
              <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
                <Text style={styles.buttonText}>Send Email</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.button}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            )}

          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default ForgotPassword; 