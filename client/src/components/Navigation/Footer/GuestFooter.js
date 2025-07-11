import { Link } from "react-router-dom";

const GuestFooter = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/wholesale">Wholesale</Link>
            </li>
            <li>
              <Link to="/retail">Retail</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
             <li>
               <Link to="/terms-and-conditions">Terms and Conditions</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Account</h3>
          <ul className="footer-links">
            <li>
              <Link to="/login-options">Login</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>
          <div className="footer-links-content">
            <div>
              <strong>Sri Dhanvantari Exports</strong>
            </div>
            <div>
              Ganesh Nagar, Puzhuthivakkam, Madipakkam Chennai-600091, Tamil
              Nadu, India.
            </div>
            <div>
              {" "}
              <strong>Email: </strong>sales@sridhanvantariexports.com
            </div>
            <div>
              <strong>Mobile / Whatsapp </strong>
            </div>
            <div>+91 99437 60055</div>
          </div>
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

export default GuestFooter;
