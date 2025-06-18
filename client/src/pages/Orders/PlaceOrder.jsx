import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Common/Message";
import ProgressSteps from "../../components/Protected_Routes/User/Cart/ProgressSteps";
import Loader from "../../components/Common/Loader";
import {
  useCreateOrderMutation,
  useGetRazorPayKeyIdQuery,
} from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import getImage from "../../Utils/GetImage";
import formatCurrency from "../../Utils/FormatCurrency";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  const { data: razorpayKey } = useGetRazorPayKeyIdQuery();

  console.log("keyyyyy", razorpayKey);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      const options = {
        key: razorpayKey,
        amount: cart.totalPrice,
        currency: "INR",
        name: "Shri Dhanvantari Exports",
        description: "Product Buying Payment Transaction",
        order_id: res.RazorPay_Order.id,
        handler: async (response) => {
          try {
            alert("Payment successful!");
            dispatch(clearCartItems());
            navigate(`/order/${res.order.id}`);
          } catch (err) {
            console.error("Error updating payment status:", err);
            alert("Payment success but failed to update status.");
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4E474A",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="order-container">
      <ProgressSteps step1 step2 step3 />

      <div className="order-container">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="order-table-container">
            <table className="order-table">
              <thead>
                <tr>
                  <th className="table-header">Image</th>
                  <th className="table-header">Product</th>
                  <th className="table-header">Quantity</th>
                  <th className="table-header">Price</th>
                  <th className="table-header">Total</th>
                </tr>
              </thead>

              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">
                      <img
                        src={getImage(item?.image, "ProductImage")}
                        alt={item.name}
                        className="product-thumbnail"
                      />
                    </td>
                    <td className="table-cell">
                      <Link
                        to={`/product/${item.product}`}
                        className="product-link"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="table-cell">{item.qty}</td>
                    <td className="table-cell">${item.price.toFixed(2)}</td>
                    <td className="table-cell">
                      ${(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="order-summary">
          <h2 className="title text-animation" style={{ marginBottom: "2rem" }}>
            Order Summary
          </h2>
          <div className="summary-details">
            <ul className="price-list">
              <li className="price-item">
                <span className="price-label">Items: </span>
                <span className="info-text">
                  {formatCurrency(cart?.itemsPrice)}
                  
                </span>
              </li>
              <li className="price-item">
                <span className="price-label">Shipping: </span>
                <span className="info-text">
                  {formatCurrency(cart?.shippingPrice)}
                 
                </span>
              </li>
              <li className="price-item">
                <span className="price-label">Tax: </span>
                <span className="info-text">
                  {formatCurrency(cart?.taxPrice)}
                 
                </span>
              </li>
              <li className="price-item">
                <span className="price-label">Total: </span>
                <span className="info-text">
                  {formatCurrency(cart?.totalPrice)}
                 
                </span>
              </li>
            </ul>

            {error && <Message variant="danger">{error.data.message}</Message>}

            <div className="shipping-info">
              <h4 className="title text-animation">Shipping</h4>
              <p className="info-text">
                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </div>

            <div className="payment-info">
              <h4 className="title text-animation">Payment Method</h4>
              <p className="info-text">
                <strong>Method:</strong> {cart.paymentMethod}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-customized"
            disabled={cart.cartItems === 0}
            onClick={placeOrderHandler}
            style={{ marginTop: "2rem", width: "100%" }}
          >
            Place Order
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
