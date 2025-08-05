import React, { useState, useEffect } from 'react';

const ResetPassword = () => {
  // Extract reset key and login from URL
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get('key');      // reset token
  const login = urlParams.get('login');  // username or login

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Determine if form can be submitted
  const canSubmit = password && confirmPassword && password === confirmPassword;

  // Clear messages on input change
  useEffect(() => {
    setError('');
    setMessage('');
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!key || !login) {
      setError('Invalid or missing password reset link.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://db.store1920.com/wp-json/custom/v1/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, login, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to reset password.');
      } else {
        setMessage('✅ Password has been reset successfully! You can now log in.');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Inline styles for the form container and elements
  const containerStyle = {
    maxWidth: 420,
    margin: '60px auto',
    padding: 30,
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#fff',
    color: '#333',
    textAlign: 'center',
  };

  const headingStyle = {
    marginBottom: 24,
    fontWeight: '700',
    fontSize: 24,
  };

  const labelStyle = {
    display: 'block',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 8,
    color: '#444',
  };

  const inputStyle = {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: '1.5px solid #ccc',
    marginBottom: 20,
    boxSizing: 'border-box',
    outlineOffset: 2,
    outlineColor: '#0073aa',
    transition: 'border-color 0.3s',
  };

  const buttonStyle = {
    width: '100%',
    padding: 14,
    fontSize: 16,
    fontWeight: '700',
    borderRadius: 10,
    border: 'none',
    cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
    backgroundColor: canSubmit && !loading ? '#0073aa' : '#9fc1e7',
    color: '#fff',
    boxShadow: canSubmit && !loading ? '0 4px 14px rgba(0,115,170,0.5)' : 'none',
    userSelect: 'none',
    transition: 'background-color 0.3s ease',
  };

  const messageStyle = {
    marginTop: 20,
    fontWeight: '600',
    fontSize: 14,
    color: message ? '#2e7d32' : '#d32f2f',
    wordBreak: 'break-word',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Reset Password</h2>

      {/* Show error if link params are missing */}
      {(!key || !login) ? (
        <p style={{ color: '#d32f2f', fontWeight: '600' }}>
          Invalid or missing password reset link.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }} noValidate>
          <label htmlFor="password" style={labelStyle}>
            New Password:
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            autoComplete="new-password"
            required
            minLength={6}
          />

          <label htmlFor="confirmPassword" style={labelStyle}>
            Confirm Password:
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            autoComplete="new-password"
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={!canSubmit || loading}
            style={buttonStyle}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      {/* Show success or error messages */}
      {(message || error) && (
        <p role="alert" style={messageStyle}>
          {message || `❌ ${error}`}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
