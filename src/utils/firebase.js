// src/firebase.js

// Import Firebase functions from the SDK
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1_taRzacQqdbjL4qdjsv_HxRS4lEThKA",
  authDomain: "store1920-7d673.firebaseapp.com",
  projectId: "store1920-7d673",
  storageBucket: "store1920-7d673.appspot.com",
  messagingSenderId: "999210993204",
  appId: "1:999210993204:web:2829662f9e52a489c32c61",
  measurementId: "G-9ELKQ87BJ1"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and providers
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Export the auth instance and providers for use in your app
export {
  auth,
  googleProvider,
  facebookProvider,
};
