import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

// API endpoints
const COIN_API_URL = 'https://db.store1920.com/wp-json/custom/v1/coins';
const REDEEM_API_URL = 'https://db.store1920.com/wp-json/custom/v1/redeem-coins';

// Conversion rate: every 10 coins = AED 1
const AED_PER_10_COINS = 1;

// TODO: Replace with your actual WP username and app password if Basic Auth is needed
const WP_USERNAME = 'your_wp_username';
const WP_APP_PASSWORD = 'your_app_password';

const CoinBalance = ({ onCoinRedeem }) => {
  const { user } = useAuth();

  const [coins, setCoins] = useState(0);
  const [redeemCoins, setRedeemCoins] = useState('');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's current coin balance
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      console.warn('User not found');
      return;
    }

    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${COIN_API_URL}/${user.id}`, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // Send cookies if needed
        });
        setCoins(response.data.coins ?? 0);
      } catch (err) {
        console.error('Error fetching coin balance:', err);
        setError('Failed to load coin balance.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [user]);

  // Handle redeeming coins
  const handleRedeem = async () => {
    const coinsToRedeem = parseInt(redeemCoins, 10);

    // Validation
    if (!coinsToRedeem || coinsToRedeem <= 0 || coinsToRedeem > coins) {
      alert('Please enter a valid number of coins to redeem.');
      return;
    }

    const discount = Math.floor(coinsToRedeem / 10) * AED_PER_10_COINS;

    setRedeeming(true);
    setError(null);

    try {
      const response = await axios.post(
        REDEEM_API_URL,
        { coins: coinsToRedeem },
        {
          // If your API requires Basic Auth, uncomment below:
          // auth: {
          //   username: WP_USERNAME,
          //   password: WP_APP_PASSWORD,
          // },
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const newBalance = response.data.new_balance;
      setCoins(newBalance);
      setRedeemCoins('');
      onCoinRedeem?.({ coinsUsed: coinsToRedeem, discountAED: discount });
      alert('Redeem successful!');
    } catch (err) {
      console.error('Redeem failed:', err);
      const message =
        err.response?.data?.message || 'Failed to redeem coins. Please try again.';
      alert(message);
      setError(message);
    } finally {
      setRedeeming(false);
    }
  };

  // Calculate discount preview shown below input
  const discountPreview =
    Math.floor(parseInt(redeemCoins || '0', 10) / 10) * AED_PER_10_COINS;

  return (
    <div
      className="coin-section"
      style={{
        border: '1px solid #eaeaea',
        borderRadius: 12,
        padding: 16,
        background: '#fefefe',
        marginTop: 24,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 16 }}>My Coins</span>
        <span
          style={{
            backgroundColor: '#fcd34d',
            padding: '6px 12px',
            borderRadius: 16,
            fontWeight: 600,
            fontSize: 14,
            color: '#000',
          }}
        >
          {loading ? 'Loading...' : `${coins} coins`}
        </span>
      </div>

      {!loading && (
        <>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="number"
              min="0"
              max={coins}
              value={redeemCoins}
              onChange={(e) => setRedeemCoins(e.target.value)}
              placeholder="Enter coins to redeem"
              disabled={redeeming}
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #ccc',
                borderRadius: 8,
              }}
            />
            <button
              onClick={handleRedeem}
              disabled={redeeming}
              style={{
                backgroundColor: redeeming ? '#aaa' : '#ff6f00',
                color: '#fff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: 8,
                fontWeight: 600,
                cursor: redeeming ? 'not-allowed' : 'pointer',
              }}
            >
              {redeeming ? 'Redeeming...' : 'Redeem'}
            </button>
          </div>

          <p style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
            Every 10 coins = AED {AED_PER_10_COINS}
          </p>

          {redeemCoins && discountPreview > 0 && (
            <p style={{ fontSize: 13, color: '#000', marginTop: 6 }}>
              You will get <strong>AED {discountPreview}</strong> off
            </p>
          )}

          {error && (
            <p style={{ color: 'red', marginTop: 8, fontSize: 14 }}>{error}</p>
          )}
        </>
      )}
    </div>
  );
};

export default CoinBalance;
