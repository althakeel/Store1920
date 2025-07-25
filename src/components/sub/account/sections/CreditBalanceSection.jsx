import React, { useEffect, useState } from 'react';
import '../../../../assets/styles/myaccount/creditBalanceSection.css'
import axios from 'axios';

const API_BASE = 'https://db.store1920.com/wp-json/custom/v1'; // Replace with your actual API if different

const CreditBalanceSection = ({ customerEmail }) => {
  const [coinBalance, setCoinBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerEmail) return;

    const fetchCoinData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/coins`, {
          params: { email: customerEmail }
        });

        setCoinBalance(res.data.balance || 0);
        setHistory(res.data.history || []);
      } catch (err) {
        console.error('Failed to fetch credit data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [customerEmail]);

  const convertToAED = (coins) => (coins / 10).toFixed(2);

  return (
    <div className="credit-balance-container">
      <div className="balance-header">
        <h2>Credit Balance</h2>
        <button className="coin-btn">
          Coins: {coinBalance}
        </button>
      </div>

      <p className="safe-note">All data is encrypted</p>
      <p className="scam-warning">
        Be wary of scams and messages imitating Store1920. We don't ask customers for extra fees via SMS or email.
      </p>

      <div className="total-section">
        <span>Total (AED):</span>
        <span className="total-value">AED {convertToAED(coinBalance)}</span>
      </div>

      <h3 className="history-title">History</h3>

      {loading ? (
        <p>Loading credit history...</p>
      ) : history.length === 0 ? (
        <div className="empty-history">You don't have any activities</div>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.description}</td>
                <td>{item.amount} coins</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

 
    </div>
  );
};

export default CreditBalanceSection;
