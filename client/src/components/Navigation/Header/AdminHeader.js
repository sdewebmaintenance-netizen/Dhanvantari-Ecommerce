import React, { useState } from 'react';

const AdminHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <span className="green">WORLD</span><span className="brown">EXPORT</span>
          <div className="tagline">High quality Wood Manufacturer</div>
        </div>
        <nav className="nav-links">
          <a href="#">ABOUT US</a>
          <a href="#">PRODUCT</a>
          <div
            className="dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <a href="#" className="green-link">SERVICES</a>
            {showDropdown && (
              <div className="dropdown-content">
                <a href="#">DOMESTIC<br />TRANSPORT</a>
                <a href="#">LOGISTICS PARTNER<br />WORLD WIDE</a>
                <a href="#">FAST & EASY<br />PROCEDURE</a>
              </div>
            )}
          </div>
          <a href="#">EXPORT MARKET</a>
          <a href="#">CONTACT</a>
          <span className="search-icon">🔍</span>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
