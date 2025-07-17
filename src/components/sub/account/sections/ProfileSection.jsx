import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://store1920.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_8adb881aaff96e651cf69b9a8128aa5c80eb46';
const CONSUMER_SECRET = 'cs_595f6cb2c159c14024d77a2a87fa0b6947041f9f';

const units = ['IN', 'LBS', 'CM', 'KG'];

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
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

  // On mount, get logged-in user email from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email) setCustomerEmail(parsedUser.email);
      } catch {
        // ignore parse errors
      }
    } else {
      setLoading(false); // no user logged in
    }
  }, []);

  // Fetch WooCommerce customer info using email
  useEffect(() => {
    if (!customerEmail) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userRes = await axios.get(`${API_BASE}/customers`, {
          params: {
            consumer_key: CONSUMER_KEY,
            consumer_secret: CONSUMER_SECRET,
            email: customerEmail,
          },
        });

        if (userRes.data.length > 0) {
          const userData = userRes.data[0];
          setUser(userData);
          setUsernameInput(userData.username || '');

          // You should replace the following with actual API calls for measurements and stats
          setMeasurements({
            unit: 'IN',
            bust: '',
            waist: '',
            hip: '',
            height: '',
            weight: '',
          });

          setStats({ totalReviews: 0, helpfuls: 0 }); // replace with actual fetched stats if available
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Error fetching user data', e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [customerEmail]);

  const handleUsernameEdit = () => {
    setEditingUsername(true);
    setShowMoreSettings(false);
  };

  const handleUsernameSave = async () => {
    try {
      // Update username API call here, example:
      // await axios.put(`${API_BASE}/customers/${user.id}`, { username: usernameInput }, {...});

      // For now, just update local state
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
      // Save measurements to backend here

      alert('Measurements saved successfully!');
      setSavingMeasurements(false);
      setShowMoreSettings(false);
    } catch (e) {
      console.error('Failed to save measurements', e);
      setSavingMeasurements(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  if (!user)
    return (
      <div style={{ textAlign: 'center', padding: 30 }}>
        <h3>No user profile found</h3>
        <p>Please sign in first to view your profile.</p>
      </div>
    );

  return (
    <div
      className="profile-section"
      style={{
        maxWidth: 480,
        margin: 'auto',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      }}
    >
      {/* Profile Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <img
          src={user.avatar_url || 'https://via.placeholder.com/80'}
          alt="Profile"
          style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <h2 style={{ margin: 0 }}>
            {user.first_name} {user.last_name}
          </h2>
          {!editingUsername ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <p style={{ margin: 0, fontWeight: '600' }}>Username: {user.username}</p>
              <button onClick={handleUsernameEdit} style={{ cursor: 'pointer' }}>
                Edit
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                style={{ padding: 6, fontSize: 16 }}
              />
              <button onClick={handleUsernameSave} disabled={!usernameInput.trim()}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Show More Settings button after username edit */}
      {!editingUsername && (
        <button
          onClick={() => setShowMoreSettings((prev) => !prev)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#d35400',
            border: 'none',
            color: '#fff',
            borderRadius: 6,
            cursor: 'pointer',
            marginBottom: 20,
          }}
        >
          {showMoreSettings ? 'Hide Settings' : 'More Settings'}
        </button>
      )}

      {/* Measurements Form */}
      {showMoreSettings && (
        <div
          style={{
            border: '1px solid #ddd',
            padding: 20,
            borderRadius: 8,
            backgroundColor: '#fff3e0',
            marginBottom: 20,
          }}
        >
          <h3>Measurements</h3>
          <p style={{ fontSize: 14, color: '#555' }}>
            Measurements provided will be saved and used for recommending sizes suitable to these
            measurements in future purchases.
          </p>

          {/* Unit Selector */}
          <div style={{ marginBottom: 10 }}>
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
            <div key={field} style={{ marginBottom: 10 }}>
              <label style={{ textTransform: 'capitalize', marginRight: 10 }}>
                {field.replace(/^\w/, (c) => c.toUpperCase())} size:
              </label>
              <select
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
            onClick={handleSubmitMeasurements}
            disabled={savingMeasurements}
            style={{
              marginTop: 12,
              padding: '10px 18px',
              backgroundColor: '#d35400',
              border: 'none',
              color: '#fff',
              borderRadius: 6,
              cursor: 'pointer',
            }}
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
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>{stats.totalReviews}</p>
          <p style={{ margin: 0, color: '#777' }}>Total reviews</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>{stats.helpfuls}</p>
          <p style={{ margin: 0, color: '#777' }}>Helpfuls</p>
        </div>
      </div>

      {/* Privacy & Reviews Empty */}
      <div style={{ fontSize: 13, color: '#777', marginBottom: 12 }}>
        Your information and privacy will be kept secure and uncompromised.
      </div>

      <div
        style={{
          padding: 24,
          border: '1px solid #ddd',
          borderRadius: 10,
          textAlign: 'center',
          color: '#666',
          backgroundColor: '#fafafa',
        }}
      >
        <p style={{ fontWeight: '600', marginBottom: 6 }}>Review is empty</p>
        <p>You have no completed reviews or the reviews have been deleted.</p>
      </div>
    </div>
  );
};

export default ProfileSection;
