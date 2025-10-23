import React, { useState } from 'react';
import { View, Text, ImageBackground, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from './styles';
import useAPIService from '../../../services/APIService';
import useGlobalFunctions from '../../../services/GlobalService';

const PinVerification = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const showback = route?.params?.showback;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useGlobalFunctions();
  const { sendRequest } = useAPIService();


  const handlePasswordReset = async () => {
    console.log('inside password reset verification', password, confirmPassword)
    if (!password.trim()) {
      showToast('Please enter your password!');
      return;
    }

    if (!confirmPassword.trim()) {
      showToast('Please enter your confirm password!');
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      showToast('Passwords do not match!');
      return;
    }

    setLoading(true)
    try {
      const response = await sendRequest(
        'passwordUpdate',
        {
          password: password.trim(),
          conformPassword: confirmPassword.trim(),
        },
        'POST',
        true,
        'forgot'
      );
      console.log('forgot = ', response);
      if (response.data) {
        showToast('Password reset successfully!');
        setLoading(false);
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      }
    } catch (error) {
      console.log('error = ', error.response?.data);
      showToast(error.response?.data?.message || 'Password reset failed!');
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
                placeholder="Password"
                placeholderTextColor="#fff"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
              />
            </View>

            <View style={styles.field}>
              <AntDesign name="mail" size={14} color="#fff" />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#fff"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                secureTextEntry
              />
            </View>

            {!loading ? (
              <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Reset Password</Text>
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

export default PinVerification; 