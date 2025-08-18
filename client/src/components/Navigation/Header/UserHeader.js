import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/features/auth/authSlice";
import { apiSlice } from "../../../redux/api/apiSlice";
import { FiMoreVertical, FiUser, FiLogOut } from "react-icons/fi";
import { useGetUserInfoQuery } from "../../../redux/api/usersApiSlice";
import { useFetchCartForUserQuery } from "../../../redux/api/cartApiSlice";
import getImage from "../../../Utils/GetImage";
import { FaUser } from "react-icons/fa";

const UserHeader = () => {
  const { data: userInfo } = useGetUserInfoQuery();
  const { data: cart = [] } = useFetchCartForUserQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

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
    navigate("/home");
  };

  return (
    <div className="navbar">
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
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            HOME
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            SHOP
          </NavLink>
          <NavLink
            to="/user-orders"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            My Orders
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            CART
            {cartItems?.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </NavLink>

          {isMobile ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "dropdown-item active-link" : "dropdown-item"
                }
              >
                <FiUser className="dropdown-icon" />
                Profile
              </NavLink>
              <NavLink onClick={logoutHandler}>
                <FiLogOut className="dropdown-icon" />
                Logout
              </NavLink>
            </>
          ) : (
            <div className="avatar-menu-container" ref={avatarRef}>
              <div
                className="avatar"
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              >
                <div className="avatar-initial">
                  {userInfo?.username ? (
                    <div className="avatar-initial">
                      {userInfo.username.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <FaUser size={20} />
                  )}
                </div>
              </div>

              {avatarMenuOpen && (
                <div className="avatar-dropdown">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      isActive ? "dropdown-item active-link" : "dropdown-item"
                    }
                    onClick={() => setAvatarMenuOpen(false)}
                  >
                    <FiUser className="dropdown-icon" />
                    Profile
                  </NavLink>
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
    </div>
  );
};

export default UserHeader;
