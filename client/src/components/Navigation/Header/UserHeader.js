import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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

  console.log("cart", cart, cart.length);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="logo-left">
          <img src={getImage("Logo.jpeg", "Logo")} className="logo-img" />
          <div className="logo">
            <span className="green">Sri</span>
            <span className="brown">Dhanvantari Exports</span>
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
          <Link to="/home">HOME</Link>

          <Link to="/shop">SHOP</Link>

          <Link to="/cart">
            CART
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </Link>

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
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setAvatarMenuOpen(false)}
                  >
                    <FiUser  className="dropdown-icon" />
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
    </div>
  );
};

export default UserHeader;
