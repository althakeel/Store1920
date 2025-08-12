import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/styles/SignInModal.css';
import { auth, googleProvider, facebookProvider } from '../../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';

const Alert = ({ children, onClose }) => (
  <div className="signin-error-alert">
    <div className="signin-error-content">{children}</div>
    <button
      onClick={onClose}
      className="signin-error-close"
      aria-label="Close alert"
    >
      ×
    </button>
  </div>
);

const parseErrorMsg = (rawMsg) => {
  if (!rawMsg) return null;

  const linkMatch = rawMsg.match(/<a href="([^"]+)">([^<]+)<\/a>/);
  if (linkMatch) {
    const url = linkMatch[1];
    const linkText = linkMatch[2];
    const textOnly = rawMsg
      .replace(/<a[^>]*>[^<]*<\/a>/, '')
      .replace(/<[^>]+>/g, '')
      .trim();

    return (
      <>
        <strong>Error:</strong> {textOnly}{' '}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="signin-lost-password-link"
        >
          {linkText}
        </a>
      </>
    );
  } else {
    const textOnly = rawMsg.replace(/<[^>]+>/g, '').trim();
    return <>{textOnly}</>;
  }
};

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
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateRegister = () => {
    if (!formData.name.trim()) {
      setErrorMsg('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Phone number is required');
      return false;
    }
    if (!formData.password) {
      setErrorMsg('Password is required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const validateLogin = () => {
    if (!formData.email.trim()) {
      setErrorMsg('Email is required');
      return false;
    }
    if (!formData.password) {
      setErrorMsg('Password is required');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const registerUser = async () => {
    if (!validateRegister()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      console.log('Registering user with:', formData);
      const res = await axios.post(
        'https://db.store1920.com/wp-json/custom/v1/register',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }
      );
      console.log('Registration response:', res.data);

      const loginRes = await axios.post(
        'https://db.store1920.com/wp-json/jwt-auth/v1/token',
        {
          username: formData.email,
          password: formData.password,
        }
      );
      console.log('Login after registration response:', loginRes.data);

      if (loginRes.data?.token) {
        const userInfo = {
          name: formData.name,
          image: '',
          token: loginRes.data.token,
          id: res.data.id || res.data.user_id,
          user: res.data,
        };
        login(userInfo);
        onLogin?.(userInfo);
        onClose();
      } else {
        setErrorMsg('Login failed after registration');
      }
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      const rawMsg = err.response?.data?.message || 'Registration failed';
      setErrorMsg(parseErrorMsg(rawMsg));
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      console.log('Logging in user with:', { username: formData.email, password: '******' });
      const res = await axios.post(
        'https://db.store1920.com/wp-json/jwt-auth/v1/token',
        {
          username: formData.email,
          password: formData.password,
        }
      );
      console.log('Login response:', res.data);

      if (res.data?.token) {
        const profileRes = await axios.get(
          'https://db.store1920.com/wp-json/wp/v2/users/me',
          {
            headers: {
              Authorization: `Bearer ${res.data.token}`,
            },
          }
        );
        console.log('Profile response:', profileRes.data);

        const userInfo = {
          name: profileRes.data.name || formData.email,
          image: '',
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
      console.error('Login error:', err.response?.data || err.message);
      const rawMsg = err.response?.data?.message || 'Login failed';
      setErrorMsg(parseErrorMsg(rawMsg));
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
    setErrorMsg(null);

    try {
      const provider =
        providerType === 'google' ? googleProvider : facebookProvider;
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await axios.post(
        'https://db.store1920.com/wp-json/firebase/v1/verify_token',
        { idToken }
      );

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
      const rawMsg =
        err.response?.data?.message || err.message || 'Social login failed';
      setErrorMsg(parseErrorMsg(rawMsg));
    } finally {
      setSocialLoading(false);
    }
  };

  const handleForgotPassword = () => {
    onClose();
    window.location.href = '/lost-password';
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

        <form className="signin-modal-form" onSubmit={handleSubmit} noValidate>
          {errorMsg && <Alert onClose={() => setErrorMsg(null)}>{errorMsg}</Alert>}

          {isRegister && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="signin-modal-input"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="signin-modal-input"
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="signin-modal-input"
            required
          />

          <div className="signin-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="signin-modal-input"
              required
              autoComplete="current-password"
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
                value={formData.confirmPassword}
                onChange={handleChange}
                className="signin-modal-input"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="signin-toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                }
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          )}

          <button type="submit" className="signin-submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Sign In'}
          </button>
        </form>

        {!isRegister && (
          <div
            className="signin-forgot-password-text"
            onClick={handleForgotPassword}
            role="link"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleForgotPassword();
            }}
          >
            Forgot password?
          </div>
        )}

        <div className="signin-toggle-text">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="signin-toggle-link"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="signin-toggle-link"
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
            aria-label="Sign in with Google"
          >
            <img
              src="https://db.store1920.com/wp-content/uploads/2025/07/google.png"
              alt="Google logo"
              className="signin-social-logo"
            />
            <span>Sign in with Google</span>
          </button>

          <button
            className="signin-social-btn signin-facebook-btn"
            onClick={() => handleSocialLogin('facebook')}
            disabled={socialLoading}
            aria-label="Sign in with Facebook"
          >
            <img
              src="https://db.store1920.com/wp-content/uploads/2025/07/facebook.png"
              alt="Facebook logo"
              className="signin-social-logo"
            />
            <span>Sign in with Facebook</span>
          </button>

          <button
            className="signin-social-btn signin-apple-btn"
            disabled
            aria-label="Sign in with Apple (disabled)"
          >
            <img
              src="https://db.store1920.com/wp-content/uploads/2025/07/apple-black-logo.png"
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
