import { useState } from "react";
import handleGoogleSignIn from "../../../Utils/HandleGoogleSignIn";
import { FiMoreVertical } from "react-icons/fi"; 

const GuestHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <span className="green">Sri</span>
          <span className="brown">Dhanvantari Exports</span>
          <div className="tagline">Purity in Every Grain</div>
        </div>

        <div className="mobile-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMoreVertical size={24} color="white" />
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#about" onClick={() => setMenuOpen(false)}>ABOUT US</a>
          <a href="#product" onClick={() => setMenuOpen(false)}>PRODUCT & SERVICES</a>
          <a href="#footer" onClick={() => setMenuOpen(false)}>CONTACT</a>
          <a onClick={() => { setMenuOpen(false); handleGoogleSignIn(); }}>LOGIN</a>
        </nav>
      </div>
    </header>
  );
};  

export default GuestHeader;
