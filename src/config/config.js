import { Platform } from 'react-native';

const ENV = {
  dev: {
    apiUrl: 'https://app.voovmedia.com/api/',
    profileImage: 'https://app.voovmedia.com/',
    imageUploadUrl: 'https://app.voovmedia.com/api/imageUpload',
    apiTimeout: 10000,
    environment: 'development',
  },
  staging: {
    apiUrl: 'https://app.voovmedia.com/api/',
    profileImage: 'https://app.voovmedia.com/',
    imageUploadUrl: 'https://staging-upload.example.com/',
    apiTimeout: 10000,
    environment: 'staging',
  },
  prod: {
    apiUrl: 'https://app.voovmedia.com/api/',
    profileImage: 'https://app.voovmedia.com/',
    imageUploadUrl: 'https://easybooking.sa/EasyBooking/api/imageUpload',
    apiTimeout: 10000,
    environment: 'production',
  },
};

const getEnvVars = () => {
  // You can change this based on your build configuration
  if (__DEV__) {
    return ENV.dev;
  }
  // Add logic here to determine which environment to use
  return ENV.prod;
};

const config = {
  ...getEnvVars(),
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

export default config; 