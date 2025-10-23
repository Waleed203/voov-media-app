import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';

const useGlobalFunctions = () => {

  const showToast = message => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };
  
  const set = async (key, value, type = 'string') => {
    try {
      if (type === 'string') {
        await AsyncStorage.setItem(key, value);
      } else if (type === 'object') {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  };

  const get = async (key, type = 'string') => {
    try {
      if (type === 'string') {
        return await AsyncStorage.getItem(key);
      } else if (type === 'object') {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  };

  const remove = async key => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data:', error);
      return false;
    }
  };

  const clear = async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  };

  return { set, get, remove, clear, showToast };
};

export default useGlobalFunctions; 