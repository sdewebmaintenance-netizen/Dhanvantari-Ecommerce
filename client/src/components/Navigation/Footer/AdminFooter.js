import React from 'react';
import { Link } from 'react-router-dom';

const AdminFooter = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Admin Links</h3>
          <ul  className="footer-links">
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/allproductslist">Products</Link></li>
            <li><Link to="/admin/userlist">Users</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul  className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
          </ul>
        </div>
      </div>
      
       <div className="footer-bottom">
         <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Sri Dhanvantari Exports. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default AdminFooter;