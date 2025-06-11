import { useState } from "react";
import handleGoogleSignIn from "../../../Utils/HandleGoogleSignIn";
import { FiMoreVertical } from "react-icons/fi"; 
import { Link } from "react-router-dom";
import getImage from "../../../Utils/GetImage";

const GuestHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo-left">
          <img src={getImage("Logo.jpeg")} className="logo-img" />
          <div className="logo">
            <span className="green">Sri</span>
            <span className="brown">Dhanvantari Exports</span>
            <div className="tagline">Purity in Every Grain</div>
          </div>
        </div>

        <div className="mobile-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMoreVertical size={24} />
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}  onClick={() => {
            setMenuOpen(false);
          }}>
          <Link to="/">HOME</Link>
          <Link to="/food-starch">FOOD STARCH</Link>
          <Link to="/retail">RETAIL</Link>
          <Link to="/wholesale">WHOLESALE</Link>
          <Link to="/exports">EXPORTS</Link>
          <Link to="/login-options">LOGIN</Link> 
        </nav>
      </div>  
    </header>
  );
};  

export default GuestHeader;
