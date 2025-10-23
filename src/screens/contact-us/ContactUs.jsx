import React, { useState, useRef, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import useGlobalFunctions from '../../services/GlobalService';
import useAPIService from '../../services/APIService';
import { useTheme } from '../../context/ThemeContext';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  const {showToast} = useGlobalFunctions();
  const [loading, setLoading] = useState(false);
  const {sendRequest} = useAPIService();
  const {theme} = useTheme();

  const handleContact = async () => {
    if (!name || !email || !message) {
      showToast('All fields are required.');
      return;
    }

    try {
      const params = { name, email, message };
      const response = await sendRequest('contactus', params, 'POST', true);
      const contactRes = response.data;

      if (contactRes.status) {
        showToast('Message sent successfully.');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        showToast('Failed to send message.');
      }
    } catch (error) {
      showToast('Network error. Please try again.');
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <AppHeader title="Contact Us" showBack={true} />
      <TextInput
        ref={inputRef}
        style={[styles.input, {marginTop: 20, backgroundColor: theme.mode == 'dark'? '#1E1E1E': theme.background, borderColor: theme.mode=='dark'? 'none' : theme.borderColor, borderWidth: theme.mode=='dark'? 0 : 0.4,color: theme.text}]}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={theme.text}
      />
      <TextInput
        style={[styles.input, {backgroundColor: theme.mode == 'dark'? '#1E1E1E': theme.background, borderColor: theme.mode=='dark'? 'none' : theme.borderColor, borderWidth: theme.mode=='dark'? 0 : 0.4, color: theme.text}]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor={theme.text}
      />
      <TextInput
        style={[styles.input, styles.textArea, {backgroundColor: theme.mode == 'dark'? '#1E1E1E': theme.background, borderColor: theme.mode=='dark'? 'none' : theme.borderColor, borderWidth: theme.mode=='dark'? 0 : 0.4, color: theme.text}]}
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={8}
        placeholderTextColor={theme.text}
      />
      <TouchableOpacity style={styles.button} onPress={handleContact}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    
  },
  input: {
    width: '100%',
    height: 40,
    paddingHorizontal: 15,
    borderWidth: 0.6,
    borderColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5%',
    color: '#fff',
    fontSize: 14,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 15,
  },
  textArea: {
    minHeight: 100,
    alignItems: 'start',
    justifyContent: 'start',
    color: '#fff',
    fontSize: 14,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#fff',
    // padding: 10,
  },
  button: {
    width: '100%',
    left: '5%',
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#62C9FF',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ContactUs;
