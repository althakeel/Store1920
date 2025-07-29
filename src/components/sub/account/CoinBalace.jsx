import React, { useEffect, useState } from 'react';
import axios from 'axios';

const COIN_API_URL = 'https://db.store1920.com/wp-json/coins/v1/user-balance';
const AED_PER_10_COINS = 1;

const CoinBalance = ({ onCoinRedeem }) => {
  const [coins, setCoins] = useState(0);
  const [redeemCoins, setRedeemCoins] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('jwt');

      if (!userId || !token) {
        console.error('User ID or token not found in localStorage.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${COIN_API_URL}?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCoins(response.data.coins || 0);
      } catch (error) {
        console.error('Error fetching coin balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const handleRedeem = () => {
    const value = parseInt(redeemCoins, 10);

    if (!value || value <= 0 || value > coins) {
      alert('Please enter a valid number of coins to redeem.');
      return;
    }

    const discount = Math.floor(value / 10) * AED_PER_10_COINS;

    if (discount > 0) {
      onCoinRedeem({ coinsUsed: value, discountAED: discount });
      setRedeemCoins('');
    }
  };

  return (
    <div
      className="coin-section"
      style={{
        border: '1px solid #eaeaea',
        borderRadius: '12px',
        padding: '16px',
        background: '#fefefe',
        marginTop: '24px',
        marginBottom: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '16px' }}>My Coins</span>
        <span
          style={{
            backgroundColor: '#fcd34d',
            padding: '6px 12px',
            borderRadius: '16px',
            fontWeight: 600,
            fontSize: '14px',
            color: '#000',
          }}
        >
          {loading ? 'Loading...' : `${coins} coins`}
        </span>
      </div>

      {!loading && (
        <>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number"
              min="0"
              max={coins}
              value={redeemCoins}
              onChange={(e) => setRedeemCoins(e.target.value)}
              placeholder="Enter coins to redeem"
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            />
            <button
              onClick={handleRedeem}
              style={{
                backgroundColor: '#ff6f00',
                color: '#fff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Redeem
            </button>
          </div>
          <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
            Every 10 coins = AED {AED_PER_10_COINS}
          </p>
        </>
      )}
    </div>
  );
};

export default CoinBalance;
