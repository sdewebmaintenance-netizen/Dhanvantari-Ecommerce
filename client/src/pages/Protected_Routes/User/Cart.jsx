import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import {
  useFetchCartForUserQuery,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useClearCartMutation,
} from "../../../redux/api/cartApiSlice";
import getImage from "../../../Utils/GetImage";
import formatCurrency from "../../../Utils/FormatCurrency";
import { useState, useEffect } from "react";
import Loader from "../../../components/Common/Loader";

const Cart = () => {
  const navigate = useNavigate();
  const {
    data: cart = [],
    refetch,
    isLoading: isCartLoading,
    error,
  } = useFetchCartForUserQuery();

  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
  const [deleteCart, { isLoading: isDeleting }] = useDeleteCartMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    refetch();
  }, []);

  const calculateDiscountedPrice = (price, quantity, productDiscount) => {
    if (!productDiscount) return null;

    return quantity >= productDiscount.qty
      ? price - productDiscount.pricetobereduced
      : null;
  };

  const calculateTotals = () => {
    let totalItems = 0;
    let totalOriginalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalSavings = 0;

    cart.forEach((item) => {
      const quantity = item.quantity;
      const price = item.Products?.price || 0;
      const discountedPrice =
        calculateDiscountedPrice(
          price,
          quantity,
          item.Products?.ProductDiscount
        ) || price;

      totalItems += quantity;
      totalOriginalPrice += price * quantity;
      totalDiscountedPrice += discountedPrice * quantity;
    });

    totalSavings = totalOriginalPrice - totalDiscountedPrice;

    return {
      totalItems,
      totalOriginalPrice,
      totalDiscountedPrice,
      totalSavings,
    };
  };

  const { totalItems, totalOriginalPrice, totalDiscountedPrice, totalSavings } =
    calculateTotals();

  const updateCartHandler = async (cartItemId, newQuantity) => {
    setIsProcessing(true);
    try {
      await updateCart({
        cartId: cartItemId,
        updatedCart: { quantity: parseInt(newQuantity) },
      }).unwrap();
      await refetch();
      toast.success("Cart updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.error || "Updating cart failed, try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFromCartHandler = async (cartItemId) => {
    setIsProcessing(true);
    try {
      await deleteCart(cartItemId).unwrap();
      await refetch();
      toast.success("Item removed from cart successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.error || "Removing item failed, try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const emptyCartHandler = async () => {
    setIsProcessing(true);
    try {
      await clearCart().unwrap();
      await refetch();
      toast.success("Cart emptied successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.error || "Emptying cart failed, try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  if (isCartLoading || isClearing || isDeleting || isProcessing || isUpdating)
    return <Loader />;
  if (error) return <div>Error loading cart</div>;


  return (
    <div className="cart-container">
      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <div className="empty-cart-quote">
            Don't leave your cart starchless.
          </div>
          <Link to="/shop" className="go-to-shop-btn btn-customized">
            🛍️ Add some flavor and crunch today!
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-header">
            <h2 className="title text-animation">Shopping Cart</h2>
            <button
              onClick={emptyCartHandler}
              className="btn-customized empty-cart-btn"
              disabled={isClearing || isProcessing}
            >
              Empty Cart
            </button>
          </div>

          {cart.map((item) => {
            const price = item.Products?.price || 0;
            const discountedPrice = calculateDiscountedPrice(
              price,
              item.quantity,
              item.Products?.ProductDiscount
            );
            const hasDiscount = discountedPrice !== null;

            return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={getImage(
                      item.Products?.ProductImages[0]?.image_name,
                      "ProductImage"
                    )}
                    alt={item.Products?.name}
                    className="product-image"
                  />
                </div>

                <div className="cart-item-details">
                  <Link
                    to={`/product/${item.Products?.id}`}
                    className="product-link"
                  >
                    {item.Products?.name}
                  </Link>
                  <div className="product-brand">{item.Products?.brand}</div>
                  <div className="product-price">
                    {hasDiscount ? (
                      <>
                        <span className="original-price">
                          {formatCurrency(price)}
                        </span>
                        <span className="discounted-price">
                          {formatCurrency(discountedPrice)}
                        </span>
                        <div className="discount-badge">
                          Save {formatCurrency(price - discountedPrice)} (Buy{" "}
                          {item.Products?.ProductDiscount?.qty}+)
                        </div>
                      </>
                    ) : (
                      formatCurrency(price)
                    )}
                  </div>
                </div>

                <div className="cart-item-quantity">
                  <select
                    className="quantity-select"
                    value={item.quantity}
                    onChange={(e) =>
                      updateCartHandler(item.id, Number(e.target.value))
                    }
                    disabled={isProcessing}
                  >
                    {[...Array(item.Products?.countInStock || 10).keys()].map(
                      (x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="cart-item-remove">
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCartHandler(item.id)}
                    disabled={isProcessing}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="cart-summary">
            <div className="summary-content">
              <h4 className="summary-title">Items ({totalItems})</h4>

              {totalDiscountedPrice < totalOriginalPrice ? (
                <>
                  <div className="original-total">
                    Original: {formatCurrency(totalOriginalPrice)}
                  </div>
                  <div className="discounted-total">
                    Discounted: {formatCurrency(totalDiscountedPrice)}
                  </div>
                  <div className="savings">
                    You save: {formatCurrency(totalSavings)}
                  </div>
                </>
              ) : (
                <div className="total-price">
                  Total: {formatCurrency(totalOriginalPrice)}
                </div>
              )}

              <button
                className="btn-customized"
                disabled={cart.length === 0 || isProcessing}
                onClick={checkoutHandler}
                style={{ marginTop: "1rem" }}
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
