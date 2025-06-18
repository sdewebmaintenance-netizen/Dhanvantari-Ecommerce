import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import {
  addToCart,
  removeFromCart,
} from "../../../redux/features/cart/cartSlice";
import getImage from "../../../Utils/GetImage";
import formatCurrency from "../../../Utils/FormatCurrency";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  return (
    <div className="cart-container">
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <div className="empty-cart-quote">
            Don’t leave your cart starchless.
          </div>
          <Link to="/shop" className="go-to-shop-btn btn-customized">
            🛍️ Add some flavor and crunch today!
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <h2 className="title text-animation">Shopping Cart</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img
                  src={getImage(item?.image, "ProductImage")}
                  alt={item.name}
                  className="product-image"
                />
              </div>

              <div className="cart-item-details">
                <Link to={`/product/${item.id}`} className="product-link">
                  {item.name}
                </Link>
                <div className="product-brand">{item.brand}</div>
                <div className="product-price">
                  {" "}
                  {formatCurrency(item?.price)}
                </div>
              </div>

              <div className="cart-item-quantity">
                <select
                  className="quantity-select"
                  value={item.qty}
                  onChange={(e) =>
                    addToCartHandler(item, Number(e.target.value))
                  }
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cart-item-remove">
                <button
                  className="remove-btn"
                  onClick={() => removeFromCartHandler(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <div className="summary-content">
              <h4 className="summary-title">
                Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
              </h4>
              <h2 className="summary-total">
                {formatCurrency(
                  cartItems.reduce(
                    (acc, item) => acc + item.qty * item.price,
                    0
                  )
                )}
              </h2>
              <button
                className="checkout-btn btn-customized"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
