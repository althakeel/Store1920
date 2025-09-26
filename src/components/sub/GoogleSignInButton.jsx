import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import axios from "axios";

const GoogleSignInButton = ({ onLogin }) => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken(); // Firebase ID token

      // Send Firebase ID token to WordPress REST API
      const res = await axios.post(
        "https://db.store1920.com/wp-json/custom/v1/firebase-login",
        { idToken }
      );

      const userInfo = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        token: res.data.token,
      };

      localStorage.setItem("token", userInfo.token);
      localStorage.setItem("userId", userInfo.id);
      localStorage.setItem("email", userInfo.email);

      onLogin?.(userInfo);
    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>

    </button>
  );
};

export default GoogleSignInButton;
