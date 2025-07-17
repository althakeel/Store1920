import React from 'react';
import '../../../../assets/styles/myaccount/NotificationsSection.css';

const notifications = [
  {
    title: "Promotions",
    description: "Be the first to learn about promotions, daily deals, and other exclusive savings.",
    status: "On: Email"
  },
  {
    title: "Order updates",
    description: "Receive notifications about order confirmations and shipment updates.",
    status: "On: Email"
  },
  {
    title: "Chat messages",
    description: "Never miss important messages from merchandise partners.",
    status: "On: Email"
  },
  {
    title: "Customers' activity",
    description: "Keep up with the latest shopping trends.",
    status: "On: Showing others' shopping activities."
  },
  {
    title: "Avatar and username sharing",
    description: "Share your user profile avatar and username with other users when you add a product to cart, purchase a product, or participate in a promotion and event, but it won’t affect your reviews for product.",
    status: "On: Share"
  }
];

const NotificationsSection = () => {
  return (
    <div className="notifications-container">
      <div className="info-bar">
        <span className="icon">✔</span>
        Temu does not ask customers for additional fees via SMS or email.
      </div>

      {notifications.map((item, index) => (
        <div key={index} className="notification-item">
          <div className="notification-text">
            <h3 className="notification-title">{item.title}</h3>
            <p className="notification-desc">{item.description}</p>
            <p className="notification-status">{item.status}</p>
          </div>
          <button className="edit-button">Edit</button>
        </div>
      ))}
    </div>
  );
};

export default NotificationsSection;
