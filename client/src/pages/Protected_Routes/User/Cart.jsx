import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import {
  useFetchCartForUserQuery,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useClearCartMutation,
} from "../../../redux/api/cartApiSlice";
import getImage from "../../../Utils/GetImage";
import formatCurrency from "../../../Utils/FormatCurrency";
import { useState, useEffect, useMemo } from "react";
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
  const [quantityErrors, setQuantityErrors] = useState({});

  useEffect(() => {
    refetch();
  }, []);

  const calculateDiscountedPrice = (price, quantity, productDiscount) => {
    if (!productDiscount) return null;
    return quantity >= productDiscount.qty
      ? price - productDiscount.pricetobereduced
      : null;
  };

  const { totals, quantityErrors: calculatedErrors } = useMemo(() => {
    let totalItems = 0;
    let totalOriginalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalSavings = 0;
    const newQuantityErrors = {};

    cart.forEach((item) => {
      const quantity = item.quantity;
      const price = item.Products?.price || 0;
      const discountedPrice =
        calculateDiscountedPrice(
          price,
          quantity,
          item.Products?.ProductDiscount
        ) || price;
      const minQty = item.Products?.moq || 0;

      if (minQty > 0 && quantity < minQty) {
        newQuantityErrors[item.id] = `Minimum order quantity is ${minQty}`;
      }

      totalItems += quantity;
      totalOriginalPrice += price * quantity;
      totalDiscountedPrice += discountedPrice * quantity;
    });

    totalSavings = totalOriginalPrice - totalDiscountedPrice;

    return {
      totals: {
        totalItems,
        totalOriginalPrice,
        totalDiscountedPrice,
        totalSavings,
        hasMinimumQuantityError: Object.keys(newQuantityErrors).length > 0,
      },
      quantityErrors: newQuantityErrors,
    };
  }, [cart]);

  useEffect(() => {
    setQuantityErrors(calculatedErrors);
  }, [calculatedErrors]);

  const updateCartHandler = async (cartItemId, newQuantity, product) => {
    const minQty = product?.moq || 0;

    if (minQty > 0 && newQuantity < minQty) {
      setQuantityErrors((prev) => ({
        ...prev,
        [cartItemId]: `Minimum order quantity is ${minQty}`,
      }));
      return;
    }

    setIsProcessing(true);
    try {
      await updateCart({
        cartId: cartItemId,
        updatedCart: { quantity: parseInt(newQuantity) },
      }).unwrap();
      await refetch();
      alert("Cart updated successfully");
    } catch (error) {
      console.error(error);
      alert(error?.data?.error || "Updating cart failed, try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFromCartHandler = async (cartItemId) => {
    setIsProcessing(true);
    try {
      await deleteCart(cartItemId).unwrap();
      await refetch();
      alert("Item removed from cart successfully");
    } catch (error) {
      console.error(error);
      alert(error?.data?.error || "Removing item failed, try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const emptyCartHandler = async () => {
    setIsProcessing(true);
    try {
      await clearCart().unwrap();
      await refetch();
      alert("Cart emptied successfully");
    } catch (error) {
      console.error(error);
      alert(error?.data?.error || "Emptying cart failed, try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const checkoutHandler = () => {
    if (totals.hasMinimumQuantityError) {
      alert(
        "Please ensure all items meet the minimum quantity requirements before checkout."
      );
      return;
    }
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
            const minQty = item.Products?.moq || 0;
            const stock = item.Products?.countInStock || 0;
            const options = [];

            const startQty = minQty > 0 ? minQty : 1;
            const endQty = Math.max(stock, startQty);

            for (let i = startQty; i <= endQty; i++) {
              options.push(i);
            }

            return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={
                      item.Products?.ProductImages[0]?.image_url
                     }
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
                    {[...Array(item.Products.countInStock).keys()]
                      .map((x) => x + 1)
                      .filter((x) =>
                        item.Products.moq ? x >= item.Products.moq : true
                      )
                      .map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
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
              <h4 className="summary-title">Items ({totals.totalItems})</h4>

              {totals.totalDiscountedPrice < totals.totalOriginalPrice ? (
                <>
                  <div className="original-total">
                    Original: {formatCurrency(totals.totalOriginalPrice)}
                  </div>
                  <div className="discounted-total">
                    Discounted: {formatCurrency(totals.totalDiscountedPrice)}
                  </div>
                  <div className="savings">
                    You save: {formatCurrency(totals.totalSavings)}
                  </div>
                </>
              ) : (
                <div className="total-price">
                  Total: {formatCurrency(totals.totalOriginalPrice)}
                </div>
              )}

              {totals.hasMinimumQuantityError && (
                <div className="checkout-error">
                  Please adjust quantities to meet minimum order requirements
                </div>
              )}

              <button
                className="btn-customized"
                disabled={
                  cart.length === 0 ||
                  isProcessing ||
                  totals.hasMinimumQuantityError
                }
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
