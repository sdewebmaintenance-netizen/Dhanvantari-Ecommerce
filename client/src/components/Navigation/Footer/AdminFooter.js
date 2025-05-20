import React from 'react';
import { Link } from 'react-router-dom';

const AdminFooter = () => {
  return (
    <footer className="footer admin-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Admin Links</h3>
          <ul>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/productlist">Products</Link></li>
            <li><Link to="/admin/userlist">Users</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default AdminFooter;