import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../../assets/styles/myaccount/ProfileSection.css';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_8adb881aaff96e651cf69b9a8128aa5c80eb46';
const CONSUMER_SECRET = 'cs_595f6cb2c159c14024d77a2a87fa0b6947041f9f';

const units = ['IN', 'LBS', 'CM', 'KG'];

const ProfileSection = () => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [showMoreSettings, setShowMoreSettings] = useState(false);

  const [measurements, setMeasurements] = useState({
    unit: 'IN',
    bust: '',
    waist: '',
    hip: '',
    height: '',
    weight: '',
  });

  const [savingMeasurements, setSavingMeasurements] = useState(false);

  const [stats, setStats] = useState({ totalReviews: 0, helpfuls: 0 });

  // On mount, get user ID from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id) {
          setUserId(parsedUser.id);
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user data by user ID
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userRes = await axios.get(`${API_BASE}/customers/${userId}`, {
          params: {
            consumer_key: CONSUMER_KEY,
            consumer_secret: CONSUMER_SECRET,
          },
        });

        const userData = userRes.data;
        setUser(userData);
        setUsernameInput(userData.username || '');

        // Placeholder for measurements & stats fetching, replace with your logic
        setMeasurements({
          unit: 'IN',
          bust: '',
          waist: '',
          hip: '',
          height: '',
          weight: '',
        });

        setStats({ totalReviews: 0, helpfuls: 0 });
      } catch (e) {
        console.error('Error fetching user data', e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUsernameEdit = () => {
    setEditingUsername(true);
    setShowMoreSettings(false);
  };

  const handleUsernameSave = async () => {
    try {
      // TODO: Call your API to update username here

      // Optimistic UI update:
      setUser((prev) => ({ ...prev, username: usernameInput }));
      setEditingUsername(false);
      setShowMoreSettings(true);
    } catch (e) {
      console.error('Failed to update username', e);
    }
  };

  const handleMeasurementChange = (field, value) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitMeasurements = async () => {
    setSavingMeasurements(true);
    try {
      // TODO: Save measurements to backend here

      alert('Measurements saved successfully!');
      setSavingMeasurements(false);
      setShowMoreSettings(false);
    } catch (e) {
      console.error('Failed to save measurements', e);
      setSavingMeasurements(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;

  if (!user)
    return (
      <div style={{ textAlign: 'center', padding: 30 }}>
        <h3>No user profile found</h3>
        <p>Please sign in first to view your profile.</p>
      </div>
    );

  return (
    <div className="profile-section">
      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={user.avatar_url || 'https://via.placeholder.com/80'}
          alt="Profile"
          className="profile-avatar"
        />
        <div>
          <h2 style={{ margin: 0 }}>
            {user.first_name} {user.last_name}
          </h2>
          {!editingUsername ? (
            <div className="profile-username-display">
              <p style={{ margin: 0, fontWeight: '600' }}>Username: {user.username}</p>
              <button className="edit-button" onClick={handleUsernameEdit}>
                Edit
              </button>
            </div>
          ) : (
            <div className="profile-username-edit">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                style={{ padding: 6, fontSize: 16 }}
              />
              <button className="save-button" onClick={handleUsernameSave} disabled={!usernameInput.trim()}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Show More Settings button after username edit */}
      {!editingUsername && (
        <button
          className="more-settings-button"
          onClick={() => setShowMoreSettings((prev) => !prev)}
          aria-expanded={showMoreSettings}
          aria-controls="measurements-form"
        >
          {showMoreSettings ? 'Hide Settings' : 'More Settings'}
        </button>
      )}

      {/* Measurements Form */}
      {showMoreSettings && (
        <div className="measurements-form" id="measurements-form">
          <h3>Measurements</h3>
          <p style={{ fontSize: 14, color: '#555' }}>
            Measurements provided will be saved and used for recommending sizes suitable to these
            measurements in future purchases.
          </p>

          {/* Unit Selector */}
          <div className="measurement-field" style={{ marginBottom: 10 }}>
            <label>
              Units:{' '}
              <select
                value={measurements.unit}
                onChange={(e) => handleMeasurementChange('unit', e.target.value)}
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Measurement fields */}
          {['bust', 'waist', 'hip', 'height', 'weight'].map((field) => (
            <div key={field} className="measurement-field">
              <label className="measurement-label" htmlFor={`measurement-${field}`}>
                {field.charAt(0).toUpperCase() + field.slice(1)} size:
              </label>
              <select
                id={`measurement-${field}`}
                value={measurements[field]}
                onChange={(e) => handleMeasurementChange(field, e.target.value)}
              >
                <option value="">Please select</option>
                {Array.from({ length: 50 }, (_, i) => i + 30).map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            className="submit-measurements-button"
            onClick={handleSubmitMeasurements}
            disabled={savingMeasurements}
          >
            {savingMeasurements ? 'Saving...' : 'Submit'}
          </button>

          <p style={{ fontSize: 12, marginTop: 10, color: '#555' }}>
            By clicking the "Submit" button below, you provide measurements for size
            recommendations. Learn more
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="stats-container">
        <div className="stats-item">
          <p style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>{stats.totalReviews}</p>
          <p style={{ margin: 0, color: '#777' }}>Total reviews</p>
        </div>
        <div className="stats-item">
          <p style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>{stats.helpfuls}</p>
          <p style={{ margin: 0, color: '#777' }}>Helpfuls</p>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="privacy-note">
        Your information and privacy will be kept secure and uncompromised.
      </div>

      {/* Review empty message */}
      <div className="review-empty-box">
        <p style={{ fontWeight: '600', marginBottom: 6 }}>Review is empty</p>
        <p>You have no completed reviews or the reviews have been deleted.</p>
      </div>
    </div>
  );
};

export default ProfileSection;
