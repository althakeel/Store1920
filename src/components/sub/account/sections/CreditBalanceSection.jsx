import React from 'react';
import '../../../../assets/styles/myaccount/creditBalanceSection.css';
import { useNavigate } from 'react-router-dom';
import Coin from '../../../../assets/images/coin.png'; // Adjust path if needed

const CreditBalanceSection = ({
  customerEmail,
  coinBalance,
  coinHistory,
  loadingCoins,
  coinError,
}) => {
  const navigate = useNavigate();

  const convertToAED = (coins) => (coins / 10).toFixed(2);

  const handleCoinClick = () => {
    navigate('/my-coins');
  };

  if (!customerEmail) {
    return (
      <div className="credit-balance-container">
        <p>Please sign in to view your credit balance.</p>
      </div>
    );
  }

  if (loadingCoins) {
    return (
      <div className="credit-balance-container">
        <p>Loading credit history...</p>
      </div>
    );
  }

  if (coinError) {
    return (
      <div className="credit-balance-container">
        <p>Error loading credit data: {coinError}</p>
      </div>
    );
  }

  return (
    <div className="credit-balance-container">
      <div className="balance-header">
        <h2>Credit Balance</h2>
        <div
          className="coin-btn"
          onClick={handleCoinClick}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => ['Enter', ' '].includes(e.key) && handleCoinClick()}
          title="View my coins"
          style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
        >
          <img src={Coin} alt="Coins" style={{ width: 18, height: 18 }} />
          <span style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>
            Coins: {coinBalance}
          </span>
        </div>
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

      {coinHistory.length === 0 ? (
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
            {coinHistory.map((item, index) => (
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
