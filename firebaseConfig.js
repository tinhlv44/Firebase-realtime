import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const firebaseConfig = {
    apiKey: "AIzaSyAjsAoVwTjpoDTmkId1YsER1F72d5oWOwY",
    authDomain: "fir-realtime-d2519.firebaseapp.com",
    projectId: "fir-realtime-d2519",
    storageBucket: "fir-realtime-d2519.appspot.com",
    messagingSenderId: "134540143454",
    appId: "1:134540143454:web:641089da1356357f14bdcf"
  };

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth với AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Sử dụng AsyncStorage
});

export { auth };
