// MyAccount.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/sub/account/Sidebar';

// Import your section components here
import OrderSection from '../components/sub/account/sections/OrderSection';

import ReviewsSection from '../components/sub/account/sections/ReviewsSection';
import ProfileSection from '../components/sub/account/sections/ProfileSection';
import CouponsSection from '../components/sub/account/sections/CouponsSection';
import CreditBalanceSection from '../components/sub/account/sections/CreditBalanceSection';
import FollowedStoresSection from '../components/sub/account/sections/FollowedStoresSection';
import BrowsingHistorySection from '../components/sub/account/sections/BrowsingHistorySection';
import AddressesSection from '../components/sub/account/sections/AddressesSection';
import RegionLanguageSection from '../components/sub/account/sections/RegionLanguageSection';
import PaymentMethodsSection from '../components/sub/account/sections/PaymentMethodsSection';
import SecuritySection from '../components/sub/account/sections/SecuritySection';
import PermissionsSection from '../components/sub/account/sections/PermissionsSection';
import NotificationsSection from '../components/sub/account/sections/NotificationsSection';

import '../assets/styles/myaccount.css';

const MyAccount = () => {
  return (
    <div className="account-wrapper">
      <div className="account-layout">
        <Sidebar />
        <main className="account-main">
          <Routes>
            <Route path="orders" element={<OrderSection />} />
          
            <Route path="reviews" element={<ReviewsSection />} />
            <Route path="profile" element={<ProfileSection />} />
            <Route path="coupons" element={<CouponsSection />} />
            <Route path="credit-balance" element={<CreditBalanceSection />} />
            <Route path="followed-stores" element={<FollowedStoresSection />} />
            <Route path="browsing-history" element={<BrowsingHistorySection />} />
            <Route path="addresses" element={<AddressesSection />} />
            <Route path="country-region-language" element={<RegionLanguageSection />} />
            <Route path="payment-methods" element={<PaymentMethodsSection />} />
            <Route path="account-security" element={<SecuritySection />} />
            <Route path="permissions" element={<PermissionsSection />} />
            <Route path="notifications" element={<NotificationsSection />} />
            {/* Redirect /myaccount to /myaccount/orders */}
            <Route path="" element={<Navigate to="orders" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default MyAccount;
