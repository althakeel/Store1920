import React, { useEffect, useState } from 'react';

const API_BASE = 'https://yourdomain.com/wp-json/custom/v1';

const CoinRewards = ({ userId, onApplyCoins }) => {
  const [coins, setCoins] = useState(0);
  const [coinsToUse, setCoinsToUse] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(`${API_BASE}/coins/${userId}`);
        const data = await res.json();
        setCoins(data.coins || 0);
      } catch (err) {
        console.error('Error fetching coins:', err);
      }
    };

    if (userId) {
      fetchCoins();
    }
  }, [userId]);

  const handleApply = async () => {
    if (coinsToUse <= 0 || coinsToUse > coins) {
      setMessage('Invalid coin amount');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/deduct-coins/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, coins: coinsToUse }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Applied ${coinsToUse} coins successfully!`);
        setCoins(coins - coinsToUse);
        setCoinsToUse(0);
        if (onApplyCoins) {
          onApplyCoins(coinsToUse / 10); // Send AED discount back to parent
        }
      } else {
        setMessage(data.error || 'Failed to apply coins');
      }
    } catch (err) {
      setMessage('Error applying coins');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h3>🎁 Your Coin Wallet</h3>
      <p>Balance: <strong>{coins}</strong> coins</p>
      <p>Value: <strong>{(coins / 10).toFixed(2)}</strong> AED</p>

      <div style={styles.inputRow}>
        <input
          type="number"
          value={coinsToUse}
          onChange={(e) => setCoinsToUse(Number(e.target.value))}
          placeholder="Coins to use"
          max={coins}
          min={0}
          style={styles.input}
        />
        <button onClick={handleApply} disabled={loading} style={styles.button}>
          {loading ? 'Applying...' : 'Apply Coins'}
        </button>
      </div>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f9f9f9',
    padding: '16px',
    borderRadius: '10px',
    maxWidth: '400px',
    margin: '20px auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontFamily: 'Montserrat, sans-serif',
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
    justifyContent: 'center',
  },
  input: {
    padding: '8px',
    width: '100px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '10px',
    color: '#333',
  },
};

export default CoinRewards;
