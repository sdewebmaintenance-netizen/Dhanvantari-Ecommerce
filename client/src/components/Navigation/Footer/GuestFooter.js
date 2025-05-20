import handleGoogleSignIn from "../../../Utils/HandleGoogleSignIn";

const GuestFooter = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#footer">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Account</h3>
          <ul className="footer-links">
            <li>
              <a onClick={handleGoogleSignIn}>Login</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>
          <div className="footer-links">
            <p>
              <strong>Sri Dhanvantri Exports</strong>
            </p>
            <p>
              Ganesh Nagar, Puzhuthivakkam, Madipakkam
              Chennai-600091, Tamil Nadu, India
            </p>
            <p> <strong>Email: </strong>supportwe@dhanvantri.com</p>
            <p><strong>Mobile / Whatsapp </strong></p>
            <p>+91 99999 77777 (English)</p>
          </div>
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

export default GuestFooter;
