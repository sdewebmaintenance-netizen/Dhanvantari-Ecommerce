import React from 'react';
import { Link } from 'react-router-dom';

const UserFooter = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Support</h3>
          <ul className="footer-links">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
         <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Sree Dhanvantri Exports. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default UserFooter;