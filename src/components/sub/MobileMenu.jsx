// components/MobileMenu.jsx
import React from 'react';

const decodeHtml = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const MobileMenu = ({
  isOpen,
  closeMobileMenu,
  categories,
  user,
  userDropdownOpen,
  setUserDropdownOpen,
  setSignInOpen,
  handleSignOut,
  handleCategoryHover,
  closeUserDropdown
}) => {
  return (
    <div
      className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}
      onClick={closeMobileMenu}
    >
      <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
        <ul>
          <li><a href="#" onClick={closeMobileMenu}>Best Rated</a></li>
          <li><a href="#" onClick={closeMobileMenu}>5-Star Rated</a></li>
          <li className="mobile-categories-title">Categories</li>
          {categories.map(cat => (
            <li
              key={cat.id}
              onClick={() => {
                handleCategoryHover(cat.id);
                closeMobileMenu();
              }}
            >
              {decodeHtml(cat.name)}
            </li>
          ))}
          {user ? (
            <>
              <li
                className="mobile-account-logged-in"
                title={`Hi, ${user.name}`}
                onClick={() => setUserDropdownOpen(prev => !prev)}
                style={{ position: 'relative', cursor: 'pointer' }}
              >
                <div className="mobile-account-logged-in-content">
                  <div className="avatar">
                    {user.image ? (
                      <img src={user.image} alt={user.name} />
                    ) : (
                      <div className="avatar-fallback">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="mobile-account-logged-in-text">Hi, {user.name}</span>
                </div>

                {userDropdownOpen && (
                  <ul className="mobile-user-dropdown">
                    <li><a href="/orders" onClick={() => { closeUserDropdown(); closeMobileMenu(); }}>Your Orders</a></li>
                    <li><a href="/reviews" onClick={() => { closeUserDropdown(); closeMobileMenu(); }}>Your Reviews</a></li>
                    <li><a href="/profile" onClick={() => { closeUserDropdown(); closeMobileMenu(); }}>Your Profile</a></li>
                    <li><a href="/coupons" onClick={() => { closeUserDropdown(); closeMobileMenu(); }}>Coupons & Offers</a></li>
                    <li><a href="/notifications" onClick={() => { closeUserDropdown(); closeMobileMenu(); }}>Notifications</a></li>
                    <li><a href="/history" onClick={() => { closeUserDropdown(); closeMobileMenu(); }}>Browse History</a></li>
                    <li>
                      <button
                        onClick={() => { handleSignOut(); closeUserDropdown(); closeMobileMenu(); }}
                        className="signout-btn"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </>
          ) : (
            <li
              className="mobile-account"
              onClick={() => {
                setSignInOpen(true);
                closeMobileMenu();
              }}
            >
              <img
                src="https://store1920.com/wp-content/uploads/2025/07/2-2.png"
                alt="Profile"
                className="icon-small"
              />
              <div className="mobile-account-text">
                <div className="mobile-account-main">Sign In / Register</div>
                <div className="mobile-account-sub">Account & Orders</div>
              </div>
            </li>
          )}
          <li className="mobile-support">
            <img
              src="https://store1920.com/wp-content/uploads/2025/07/3-2.png"
              alt="Support"
              className="icon-small"
            />
            <span>Support</span>
          </li>
          <li className="mobile-cart">
            <img
              src="https://store1920.com/wp-content/uploads/2025/07/1-3.png"
              alt="Cart"
              className="icon-cart"
            />
            <span>Cart</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
