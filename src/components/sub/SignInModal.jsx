import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/styles/SignInModal.css';
import { auth, googleProvider, facebookProvider } from '../../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';

const SignInModal = ({ isOpen, onClose, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateRegister = () => {
    if (!formData.name.trim()) return setErrorMsg('Name is required'), false;
    if (!formData.email.trim()) return setErrorMsg('Email is required'), false;
    if (!formData.phone.trim()) return setErrorMsg('Phone number is required'), false;
    if (!formData.password) return setErrorMsg('Password is required'), false;
    if (formData.password !== formData.confirmPassword) return setErrorMsg('Passwords do not match'), false;
    setErrorMsg('');
    return true;
  };

  const validateLogin = () => {
    if (!formData.email.trim()) return setErrorMsg('Email is required'), false;
    if (!formData.password) return setErrorMsg('Password is required'), false;
    setErrorMsg('');
    return true;
  };

  const registerUser = async () => {
    if (!validateRegister()) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.post('https://db.store1920.com/wp-json/custom/v1/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      const loginRes = await axios.post('https://db.store1920.com/wp-json/jwt-auth/v1/token', {
        username: formData.email,
        password: formData.password,
      });

      if (loginRes.data?.token) {
        const userInfo = {
          name: formData.name,
          image: '',
          token: loginRes.data.token,
          id: res.data.id || res.data.user_id, // ✅ get from register response
          user: res.data,
        };
        login(userInfo);
        onLogin?.(userInfo);
        onClose();
      } else {
        setErrorMsg('Login failed after registration');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    setErrorMsg('');
  
    try {
      const res = await axios.post('https://db.store1920.com/wp-json/jwt-auth/v1/token', {
        username: formData.email,
        password: formData.password,
      });
  
      if (res.data?.token) {
        // ✅ Fetch user info using the token
        const profileRes = await axios.get('https://db.store1920.com/wp-json/wp/v2/users/me', {
          headers: {
            Authorization: `Bearer ${res.data.token}`,
          },
        });
  
        const userInfo = {
          name: profileRes.data.name || formData.email,
          image: '', // or add profileRes.data.avatar_urls?.['96']
          token: res.data.token,
          id: profileRes.data.id,
          user: profileRes.data,
        };
  
        login(userInfo);
        onLogin?.(userInfo);
        onClose();
      } else {
        setErrorMsg('Invalid login credentials');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    isRegister ? registerUser() : loginUser();
  };

  const handleSocialLogin = async (providerType) => {
    setSocialLoading(true);
    setErrorMsg('');

    try {
      const provider = providerType === 'google' ? googleProvider : facebookProvider;
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await axios.post('https://db.store1920.com/wp-json/firebase/v1/verify_token', { idToken });

      if (res.data?.token) {
        const userInfo = {
          name: user.displayName,
          image: user.photoURL,
          token: res.data.token,
          user: { id: res.data.user_id, email: res.data.email },
          id: res.data.user_id,
        };
        login(userInfo);
        onLogin?.(userInfo);
        onClose();
      } else {
        setErrorMsg('Could not sync with WordPress');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Social login failed');
    } finally {
      setSocialLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="signin-modal-overlay" onClick={onClose} />
      <div className="signin-modal-container">
        <button className="signin-modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        <h2>{isRegister ? 'Register' : 'Sign In'}</h2>

        <form className="signin-modal-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="signin-modal-input" required />
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="signin-modal-input" required />
            </>
          )}

          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="signin-modal-input" required />

          <div className="signin-input-wrapper">
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="signin-modal-input" required />
            <button type="button" className="signin-toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</button>
          </div>

          {isRegister && (
            <div className="signin-input-wrapper">
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="signin-modal-input" required />
              <button type="button" className="signin-toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? '🙈' : '👁️'}</button>
            </div>
          )}

          {errorMsg && <div className="signin-error-msg">{errorMsg}</div>}

          <button type="submit" className="signin-submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div className="signin-toggle-text">
          {isRegister ? (
            <>Already have an account? <button type="button" onClick={() => setIsRegister(false)} className="signin-toggle-link">Sign In</button></>
          ) : (
            <>Don’t have an account? <button type="button" onClick={() => setIsRegister(true)} className="signin-toggle-link">Register</button></>
          )}
        </div>

        <div className="signin-social-login">
          <button className="signin-social-btn signin-google-btn" onClick={() => handleSocialLogin('google')} disabled={socialLoading}>
            <img src="https://db.store1920.com/wp-content/uploads/2025/07/google.png" alt="Google logo" className="signin-social-logo" />
            <span>Sign in with Google</span>
          </button>

          <button className="signin-social-btn signin-facebook-btn" onClick={() => handleSocialLogin('facebook')} disabled={socialLoading}>
            <img src="https://db.store1920.com/wp-content/uploads/2025/07/facebook.png" alt="Facebook logo" className="signin-social-logo" />
            <span>Sign in with Facebook</span>
          </button>

          <button className="signin-social-btn signin-apple-btn" disabled>
            <img src="https://db.store1920.com/wp-content/uploads/2025/07/apple-black-logo.png" alt="Apple logo" className="signin-social-logo" />
            <span>Sign in with Apple</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SignInModal;