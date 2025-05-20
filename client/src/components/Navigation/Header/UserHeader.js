import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../../redux/api/usersApiSlice";
import { logout } from "../../../redux/features/auth/authSlice";
import FavoritesCount from "../../../pages/Products/FavoritesCount";
import { FiMoreVertical } from "react-icons/fi";

const UserHeader = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <span className="green">Sri</span>
          <span className="brown">Dhanvantari Exports</span>
          <div className="tagline">Purity in Every Grain</div>
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
            {/*  {cartItems.length > 0 && (
              <span className="badge">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )} */}
          </Link>

          <Link to="/favorite">
            FAVORITES
            {/* <FavoritesCount /> */}
          </Link>

          <Link to="/">LOGOUT</Link>

          {/*  <div className="nav-link logout-link" onClick={logoutHandler}>
            <span className="nav-label">LOGOUT</span>
          </div> */}
        </nav>
      </div>
    </div>
  );
};
export default UserHeader;
