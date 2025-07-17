import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Coin from '../assets/images/coin.png'

const API_BASE = 'https://store1920.com/wp-json/custom/v1';

const CoinWidget = ({ userId }) => {
  const [coins, setCoins] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchCoins = async () => {
      try {
        const res = await fetch(`${API_BASE}/coins/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch coins');
        const data = await res.json();
        setCoins(data.coins || 0);
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    fetchCoins();
  }, [userId]);

  const handleClick = () => {
    navigate('/my-coins'); // your page for coin details
  };

  return (
    <div style={styles.widget} onClick={handleClick} role="button" tabIndex={0} onKeyPress={handleClick}>
      <img
        src={Coin}
        alt="Coins"
        style={styles.icon}
      />
      <span style={styles.text}>{coins} Coins</span>
    </div>
  );
};

const styles = {
  widget: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
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
