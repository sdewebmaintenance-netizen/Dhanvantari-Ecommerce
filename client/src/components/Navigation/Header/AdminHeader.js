import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/features/auth/authSlice";
import { apiSlice } from "../../../redux/api/apiSlice";
import { FiMoreVertical, FiUser, FiLogOut } from "react-icons/fi";
import { useGetUserInfoQuery } from "../../../redux/api/usersApiSlice";
import getImage from "../../../Utils/GetImage";

const AdminHeader = () => {
  const { data: userInfo } = useGetUserInfoQuery();
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogoClick = () => {
    navigate("/dashboard"); 
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
          <FiMoreVertical size={24} color="white"/>
        </div>

        <nav
          className={`nav-links ${menuOpen ? "open" : ""}`}
          onClick={() => {
            setMenuOpen(false);
          }}
        >
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/orderlist">Orders</Link>
          <Link to="/admin/allproductslist">Products</Link>
          <Link to="/admin/categorylist">Category</Link>
          <Link to="/admin/incotermlist">Inco Term</Link>
          <Link to="/admin/portlist">Port</Link>
          <Link to="/admin/discount">Discount</Link>
          <Link to="/admin/userlist">Users</Link>
          {isMobile ? (
            <>
              <Link to="/profile" className="dropdown-item">
                <FiUser className="dropdown-icon" />
                Profile
              </Link>
              <Link onClick={logoutHandler}>
                <FiLogOut className="dropdown-icon" />
                Logout
              </Link>
            </>
          ) : (
            <div className="avatar-menu-container" ref={avatarRef}>
              <div
                className="avatar"
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              >
                <div className="avatar-initial">
                  {userInfo?.username?.charAt(0).toUpperCase()}
                </div>
              </div>

              {avatarMenuOpen && (
                <div className="avatar-dropdown">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setAvatarMenuOpen(false)}
                  >
                    <FiUser className="dropdown-icon" />
                    Profile
                  </Link>
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      logoutHandler();
                      setAvatarMenuOpen(false);
                    }}
                  >
                    <FiLogOut className="dropdown-icon" />
                    Logout
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
