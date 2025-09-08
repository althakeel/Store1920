import React, { useState } from "react";
import axios from "axios";
import "../../assets/styles/SignInModal.css";
import { auth, googleProvider, facebookProvider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";
import GoogleSignIcon from '../../assets/images/search.png'
import FacebookIcon from '../../assets/images/facebook.png'

// ===================== Alert Component =====================
const Alert = ({ children, onClose }) => (
  <div className="signin-error-alert">
    <div className="signin-error-content">{children}</div>
    <button onClick={onClose} className="signin-error-close" aria-label="Close alert">
      ×
    </button>
  </div>
);

// ===================== Error Parser =====================
const parseErrorMsg = (rawMsg) => {
  if (!rawMsg) return null;

  // Match any <a> tag
  const linkMatch = rawMsg.match(/<a [^>]*>([^<]+)<\/a>/);

  if (linkMatch) {
    const linkText = linkMatch[1]; // keep the text
    const textOnly = rawMsg.replace(/<a[^>]*>[^<]*<\/a>/, "").replace(/<[^>]+>/g, "").trim();

    // Always point to frontend lost-password page
    return (
      <>
        <strong>Error:</strong> {textOnly}{" "}
        <a
          href="https://store1920.com/lost-password"
          target="_blank"
          rel="noopener noreferrer"
          className="signin-lost-password-link"
        >
          {linkText}
        </a>
      </>
    );
  }

  return <>{rawMsg.replace(/<[^>]+>/g, "").trim()}</>;
};

// ===================== Main Component =====================
const SignInModal = ({ isOpen, onClose, onLogin }) => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  // add state
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const FRONTEND_URL = "https://store1920.com";

  // ===================== Handlers =====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgotPassword = () => {
    onClose();
    window.location.href = `${FRONTEND_URL}/lost-password`;
  };

  // ===================== Validation =====================
  const validateRegister = () => {
    if (!formData.name.trim()) return setErrorMsg("Name is required"), false;
    if (!formData.email.trim()) return setErrorMsg("Email is required"), false;
    if (!formData.phone.trim()) return setErrorMsg("Phone number is required"), false;
    if (!formData.password) return setErrorMsg("Password is required"), false;
    if (formData.password !== formData.confirmPassword) return setErrorMsg("Passwords do not match"), false;
    setErrorMsg(null);
    return true;
  };

  const validateLogin = () => {
    if (!formData.email.trim()) return setErrorMsg("Email is required"), false;
    if (!formData.password) return setErrorMsg("Password is required"), false;
    setErrorMsg(null);
    return true;
  };

  // ===================== API Calls =====================
  const registerUser = async () => {
    if (!validateRegister()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await axios.post("https://db.store1920.com/wp-json/custom/v1/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      const loginRes = await axios.post("https://db.store1920.com/wp-json/jwt-auth/v1/token", {
        username: formData.email,
        password: formData.password,
      });

      if (loginRes.data?.token) {
        const userInfo = {
          name: formData.name,
          image: "",
          token: loginRes.data.token,
          id: res.data.id || res.data.user_id,
          user: res.data,
        };
        login(userInfo);
        localStorage.setItem("userId", userInfo.id); // save user ID
        onLogin?.(userInfo);
        onClose();
      } else {
        setErrorMsg("Login failed after registration");
      }
    } catch (err) {
      setErrorMsg(parseErrorMsg(err.response?.data?.message || "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await axios.post("https://db.store1920.com/wp-json/jwt-auth/v1/token", {
        username: formData.email,
        password: formData.password,
      });

      if (res.data?.token) {
        const profileRes = await axios.get("https://db.store1920.com/wp-json/wp/v2/users/me", {
          headers: { Authorization: `Bearer ${res.data.token}` },
        });

        const userInfo = {
          name: profileRes.data.name || formData.email,
          image: "",
          token: res.data.token,
          id: profileRes.data.id,
          user: profileRes.data,
        };

        login(userInfo);
        localStorage.setItem("userId", userInfo.id); // save user ID
        onLogin?.(userInfo);
        onClose();
      } else {
        setErrorMsg("Invalid login credentials");
      }
    } catch (err) {
      setErrorMsg(parseErrorMsg(err.response?.data?.message || "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerType) => {
    setSocialLoading(true);
    setErrorMsg(null);

    try {
      const provider = providerType === "google" ? googleProvider : facebookProvider;
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await axios.post("https://db.store1920.com/wp-json/firebase/v1/verify_token", { idToken });

      if (res.data?.token) {
        const userInfo = {
          name: user.displayName,
          image: user.photoURL,
          token: res.data.token,
          user: { id: res.data.user_id, email: res.data.email },
          id: res.data.user_id,
        };
        login(userInfo);
        localStorage.setItem("userId", userInfo.id); // save user ID
        onLogin?.(userInfo);
        onClose();
      } else {
        setErrorMsg("Could not sync with WordPress");
      }
    } catch (err) {
      setErrorMsg(parseErrorMsg(err.response?.data?.message || err.message || "Social login failed"));
    } finally {
      setSocialLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isRegister ? registerUser() : loginUser();
  };

  if (!isOpen) return null;

  // ===================== Render =====================
  return (
    <>
      <div className="signin-modal-overlay" onClick={onClose} />
      <div className="signin-modal-container" role="dialog" aria-modal="true">
        <button className="signin-modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="signin-modal-header">
          <h2 className="signin-modal-title">Sign in / Register</h2>
          <div className="signin-security">🔒 All data will be encrypted</div>

          <div className="signin-benefits">
            <div className="benefit-item">
              🚚 Free shipping <span className="benefit-subtext">Special for you</span>
            </div>
            <div className="benefit-item">
              ↩ Free returns <span className="benefit-subtext">Up to 90 days</span>
            </div>
          </div>
        </div>

        <form className="signin-modal-form" onSubmit={handleSubmit} noValidate>
          {errorMsg && <Alert onClose={() => setErrorMsg(null)}>{errorMsg}</Alert>}

          <input
            type="text"
            name="email"
            placeholder="Email or phone number"
            value={formData.email}
            onChange={handleChange}
            className="signin-modal-input"
            required
          />
{!isRegister && (
  <>
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
      className="signin-modal-input"
      required
    />
    <div className="signin-show-password">
      <label>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        Show password
      </label>
    </div>
  </>
)}

{isRegister && (
  <>
    {/* Password field */}
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
      className="signin-modal-input"
      required
    />

    {/* Confirm Password field */}
    <input
      type={showPassword ? "text" : "password"}  // <-- use showPassword, not showConfirmPassword
      name="confirmPassword"
      placeholder="Confirm Password"
      value={formData.confirmPassword}
      onChange={handleChange}
      className="signin-modal-input"
      required
    />

    {/* Single checkbox toggling both */}
    <div className="signin-show-password">
      <label>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        Show password
      </label>
    </div>
  </>
)}
          <button type="submit" className="signin-submit-btn" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Register" : "Continue"}
          </button>
        </form>

        {!isRegister && (
          <div className="signin-forgot-password-text" onClick={handleForgotPassword}>
            Trouble signing in?
          </div>
        )}

        <div className="signin-divider">
          <span>Or continue with</span>
        </div>

        <div className="signin-social-icons">
          <button onClick={() => handleSocialLogin("google")} disabled={socialLoading}>
            <img src={GoogleSignIcon} alt="Google" />
          </button>
          <button onClick={() => handleSocialLogin("facebook")} disabled={socialLoading}>
            <img src={FacebookIcon} alt="Facebook" />
          </button>
          <button disabled>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="Apple"
              width="30px"
              height="50px"
            />
          </button>
        </div>

        <div className="signin-terms">
          By continuing, you agree to our <a href="/terms-0f-use">Terms</a> and <a href="/privacy-policy">Privacy Policy</a>.
        </div>

        <div className="signin-toggle-text">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setIsRegister(false)} className="signin-toggle-link">
                Sign In
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button type="button" onClick={() => setIsRegister(true)} className="signin-toggle-link">
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SignInModal;
