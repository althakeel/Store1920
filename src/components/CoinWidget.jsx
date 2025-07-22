import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Coin from '../assets/images/coin.png';

const API_BASE = 'https://store1920.com/wp-json/custom/v1';

const CoinWidget = () => {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
const fetchCoins = async () => {
  try {
    const res = await fetch(`${API_BASE}/my-coins`, {
      credentials: 'include',
    });
    console.log('Response status:', res.status);
    if (!res.ok) throw new Error('Failed to fetch coins');
    const data = await res.json();
    console.log('Coins fetched:', data.coins);
    setCoins(data.coins || 0);
  } catch (error) {
    console.error('Error fetching coins:', error);
    setCoins(0);
  } finally {
    setLoading(false);
  }
};

    fetchCoins();
  }, []);

  const handleClick = () => navigate('/my-coins');

  return (
    <div
      style={styles.widget}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => ['Enter', ' '].includes(e.key) && handleClick()}
    >
      <img src={Coin} alt="Coins" style={styles.icon} />
      <span style={styles.text}>
        {loading ? 'Loading...' : `${coins} Coins`}
      </span>
    </div>
  );
};

const styles = {
  widget: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
  },
  icon: {
    width: 18,
    height: 18,
  },
  text: {
    fontWeight: 600,
    fontSize: 12,
    color: '#fff',
  },
};

export default CoinWidget;
