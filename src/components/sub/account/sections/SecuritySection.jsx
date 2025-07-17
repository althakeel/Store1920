import React, { useEffect, useState } from 'react';
import '../../../../assets/styles/myaccount/SecuritySection.css'; // Create CSS to match Temu style
import axios from 'axios';




const API_URL = 'https://store1920.com/wp-json/custom/v1/account/security';

const fallbackData = {
  email: 'rohithsagar14325@gmail.com',
  phone: null,
  hasPassword: false,
  twoFactorEnabled: false,
  googleLinked: false,
  facebookLinked: false,
  appleLinked: false,
};

const SecuritySection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(API_URL, {
        withCredentials: true, // Needed if using cookie auth (WooCommerce login)
        // headers: {
        //   Authorization: 'Bearer YOUR_TOKEN', // Uncomment if using JWT
        // }
      })
      .then((res) => {
        if (res.data && typeof res.data === 'object') {
          setData(res.data);
        } else {
          setData(fallbackData); // if API returned bad format
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Security fetch error:', err);
        setError(true);
        setData(fallbackData); // fallback to mock data
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="security-loading">Loading...</div>;

  return (
    <div className="security-section">
      <div className="security-header">
        <h3>Your account is protected</h3>
        <p>Your Store1920 account is protected by advanced security. Keeping this information up-to-date safeguards your account even more.</p>
      </div>

      {error && <div className="security-error">⚠️ Showing fallback data (API error)</div>}

      <div className="security-list">
        <div className="security-item">
          <span>Mobile phone number</span>
          <button>{data.phone ? 'Edit' : 'Add'}</button>
        </div>

        <div className="security-item">
          <span>Email</span>
          <div className="security-inline">
            <span>{data.email || 'Not set'}</span>
            <button>Edit</button>
          </div>
        </div>

        <div className="security-item">
          <span>Password</span>
          <button>{data.hasPassword ? 'Change' : 'Add'}</button>
        </div>

        <div className="security-item">
          <span>Two-factor authentication: {data.twoFactorEnabled ? 'On' : 'Off'}</span>
          <button>{data.twoFactorEnabled ? 'Manage' : 'Turn on'}</button>
        </div>

        <div className="security-subtitle">Third-party accounts</div>

        <div className="security-item">
          <span>Google</span>
          <button disabled={data.googleLinked}>
            {data.googleLinked ? 'Linked' : 'Link'}
          </button>
        </div>

        <div className="security-item">
          <span>Facebook</span>
          <button disabled={data.facebookLinked}>
            {data.facebookLinked ? 'Linked' : 'Link'}
          </button>
        </div>

        <div className="security-item">
          <span>Apple</span>
          <button disabled={data.appleLinked}>
            {data.appleLinked ? 'Linked' : 'Link'}
          </button>
        </div>

        <div className="security-footer">
          <a href="/account/signin-activity">Review sign in activity for this account</a>
          <a href="/account/delete">Delete your Store1920 account</a>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;