import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import getImage from "../../../Utils/GetImage";
import { useNavigate } from "react-router-dom";

const GuestHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo-left" onClick={handleLogoClick}>
          <img src={getImage("Logo.jpeg", "Logo")} className="logo-img" />
          <div className="logo">
            <span className="brown">Sri Dhanvantari Exports</span>
            <div className="tagline">Food Samudra for World</div>
          </div>
        </div>

        <div
          className="mobile-menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FiMoreVertical size={24} color="white" />
        </div>

        <nav
          className={`nav-links ${menuOpen ? "open" : ""}`}
          onClick={() => {
            setMenuOpen(false);
          }}
        >
          <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>HOME</NavLink>
          <NavLink to="/about-us" className={({ isActive }) => isActive ? "active-link" : ""}>ABOUT US</NavLink>
          <NavLink to="/food-starch" className={({ isActive }) => isActive ? "active-link" : ""}>FOOD STARCH</NavLink>
          <NavLink to="/retail" className={({ isActive }) => isActive ? "active-link" : ""}>RETAIL</NavLink>
          <NavLink to="/wholesale" className={({ isActive }) => isActive ? "active-link" : ""}>WHOLESALE</NavLink>
          <NavLink to="/exports" className={({ isActive }) => isActive ? "active-link" : ""}>EXPORTS</NavLink>
          <NavLink to="/contact-us" className={({ isActive }) => isActive ? "active-link" : ""}>CONTACT US</NavLink>
          <NavLink to="/login-options" className={({ isActive }) => isActive ? "active-link" : ""}>LOGIN</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default GuestHeader;
