import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/styles/SignInModal.css';
import { auth, googleProvider, facebookProvider } from '../../utils/firebase';
import { signInWithPopup } from 'firebase/auth';

const SignInModal = ({ isOpen, onClose, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const registerUser = async () => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Phone number is required');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const payload = {
        email: formData.email,
        first_name: formData.name,
        username: formData.email,
        password: formData.password,
        billing: {
          phone: formData.phone,
          first_name: formData.name,
          last_name: '',
          address_1: 'N/A',
          city: 'N/A',
          state: 'N/A',
          postcode: '00000',
          country: 'US',
        },
        shipping: {
          first_name: formData.name,
          last_name: '',
          address_1: 'N/A',
          city: 'N/A',
          state: 'N/A',
          postcode: '00000',
          country: 'US',
        },
      };

      const res = await axios.post(
        'https://store1920.com/wp-json/wc/v3/customers',
        payload,
        {
          auth: {
            username: 'ck_6ff05e8a51006adb1aa0398eb98dda7377f523c1',
            password: 'cs_07606d81530272f4c100db5f64f1dc92a510a8ac',
          },
        }
      );

      if (res.data && onLogin) {
        onLogin({ name: res.data.first_name, image: '' });
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      if (formData.email && formData.password) {
        // Replace with real login logic when ready (WP REST API or Firebase Auth)
        onLogin({ name: 'Demo User', image: '' });
        onClose();
      } else {
        setErrorMsg('Invalid credentials');
      }
    } catch {
      setErrorMsg('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      registerUser();
    } else {
      loginUser();
    }
  };

 const handleSocialLogin = async (providerType) => {
  setSocialLoading(true);
  setErrorMsg('');

  try {
    const provider = providerType === 'google' ? googleProvider : facebookProvider;
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (user) {
      const idToken = await user.getIdToken();

      // Send to your backend to verify & sync user
      const res = await axios.post(
  'https://store1920.com/wp-json/firebase/v1/verify_token', 
  { idToken }
);

      if (res.data) {
        onLogin({ name: user.displayName, image: user.photoURL, wpUser: res.data });
        onClose();
      } else {
        setErrorMsg('Failed to sync user with WordPress');
      }
    }
  } catch (error) {
    console.error('Social login error:', error);
    // Show a more detailed message if possible
    setErrorMsg(error.message || 'Social login failed');
  } finally {
    setSocialLoading(false);
  }
};


  if (!isOpen) return null;

  return (
    <>
      <div className="signin-modal-overlay" onClick={onClose} />
      <div className="signin-modal-container" role="dialog" aria-modal="true">
        <button
          className="signin-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>
        <h2>{isRegister ? 'Register' : 'Sign In'}</h2>

        <form className="signin-modal-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                className="signin-modal-input"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                className="signin-modal-input"
                value={formData.phone}
                onChange={handleChange}
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="signin-modal-input"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="signin-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              className="signin-modal-input"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="signin-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {isRegister && (
            <div className="signin-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                className="signin-modal-input"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="signin-toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          )}

          {errorMsg && <div className="signin-error-msg">{errorMsg}</div>}

          <button
            type="submit"
            className="signin-submit-btn"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div className="signin-toggle-text">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button
                className="signin-toggle-link"
                onClick={() => setIsRegister(false)}
                type="button"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{' '}
              <button
                className="signin-toggle-link"
                onClick={() => setIsRegister(true)}
                type="button"
              >
                Register
              </button>
            </>
          )}
        </div>

        <div className="signin-social-login">
          <button
            className="signin-social-btn signin-google-btn"
            onClick={() => handleSocialLogin('google')}
            disabled={socialLoading}
            aria-disabled={socialLoading}
            style={{ cursor: socialLoading ? 'not-allowed' : 'pointer' }}
          >
            <img
              src="https://store1920.com/wp-content/uploads/2025/07/google.png"
              alt="Google logo"
              className="signin-social-logo"
            />
            <span>Sign in with Google</span>
          </button>

          <button
            className="signin-social-btn signin-facebook-btn"
            onClick={() => handleSocialLogin('facebook')}
            disabled={socialLoading}
            aria-disabled={socialLoading}
            style={{ cursor: socialLoading ? 'not-allowed' : 'pointer' }}
          >
            <img
              src="https://store1920.com/wp-content/uploads/2025/07/facebook.png"
              alt="Facebook logo"
              className="signin-social-logo"
            />
            <span>Sign in with Facebook</span>
          </button>

          <button
            className="signin-social-btn signin-apple-btn"
            disabled
            aria-disabled="true"
            title="Apple sign-in coming soon"
          >
            <img
              src="https://store1920.com/wp-content/uploads/2025/07/apple-black-logo.png"
              alt="Apple logo"
              className="signin-social-logo"
            />
            <span>Sign in with Apple</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SignInModal;
