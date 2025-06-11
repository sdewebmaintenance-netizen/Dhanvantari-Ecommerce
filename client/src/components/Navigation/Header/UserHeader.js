import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FavoritesCount from "../../Protected_Routes/User/Favorite/FavoritesCount";
import { logout } from "../../../redux/features/auth/authSlice";
import { apiSlice } from "../../../redux/api/apiSlice";
import { FiMoreVertical, FiUser, FiLogOut } from "react-icons/fi";
import { useGetUserInfoQuery } from "../../../redux/api/usersApiSlice";
import getImage from "../../../Utils/GetImage";

const UserHeader = () => {
  const { data: userInfo } = useGetUserInfoQuery();
  const { cartItems } = useSelector((state) => state.cart);
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
          <img src={getImage("Logo.jpeg")} className="logo-img" />
          <div className="logo">
            <span className="green">Sri</span>
            <span className="brown">Dhanvantari Exports</span>
            <div className="tagline">Purity in Every Grain</div>
          </div>
        </div>

        <div
          className="mobile-menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FiMoreVertical size={24} />
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
            {cartItems.length > 0 && (
              <span className="cart-badge">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          {/* <Link to="/favorite">
            FAVORITES
            <div className="favorite-badge">
              <FavoritesCount />
            </div>
          </Link> */}

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
    </div>
  );
};

export default UserHeader;
