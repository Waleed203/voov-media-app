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
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useGlobalFunctions();
  const { sendRequest } = useAPIService();


  const handlePinCode = async () => {
    console.log('inside pin verification')
    if (!pin.trim()) {
      showToast('Please enter your pin code!');
      return;
    }

    setLoading(true)
    try {
      const response = await sendRequest(
        'OPTVerification',
        {
          otp: pin.trim(),
        },
        'POST',
        true,
        'forgot'
      );
      console.log('forgot = ', response);
      if (response.data) {
        showToast('Pin verified successfully!');
        setLoading(false);
        navigation.navigate('ResetPassword', {response: response.data});
      }
    } catch (error) {
      console.log('error = ', error.response?.data);
      showToast(error.response?.data?.message || 'Pin Verification failed!');
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
                placeholder="Pin Code"
                placeholderTextColor="#fff"
                value={pin}
                onChangeText={(text) => setPin(text)}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            {!loading ? (
              <TouchableOpacity style={styles.button} onPress={handlePinCode}>
                <Text style={styles.buttonText}>Verify Pin Code</Text>
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