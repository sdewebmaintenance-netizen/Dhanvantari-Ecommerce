
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
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
import { useFetchCartForUserQuery } from "../../redux/api/cartApiSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const { data: cart = [] } = useFetchCartForUserQuery();

  console.log("Sss", cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  const { data: razorpayKey } = useGetRazorPayKeyIdQuery();

  const calculateOrderSummary = () => {
    if (!cart || cart.length === 0) return {};

    let itemsPrice = 0;
    let sgstTotal = 0;
    let cgstTotal = 0;
    let taxPrice = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
      const itemPrice = item.Products.price * item.quantity;
      itemsPrice += itemPrice;

      const itemSGST = (itemPrice * item.Products.SGST) / 100;
      const itemCGST = (itemPrice * item.Products.CGST) / 100;

      sgstTotal += itemSGST;
      cgstTotal += itemCGST;
    });

    taxPrice = sgstTotal + cgstTotal;
    totalPrice = itemsPrice + taxPrice;

    return {
      itemsPrice,
      sgstTotal,
      cgstTotal,
      taxPrice,
      totalPrice,
    };
  };

  const orderSummary = calculateOrderSummary();

  const placeOrderHandler = async () => {
  try {
    const orderItems = cart.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.Products.price,
      CGST: item.Products.CGST,
      SGST: item.Products.SGST,
      name: item.Products.name,
      image: item.Products.ProductImages[0]?.image_name
    }));

    const shippingAddress = {
      id: cart[0]?.CartShippingAddress.id,
      addressLine1: cart[0]?.CartShippingAddress.addressLine1,
      addressLine2: cart[0]?.CartShippingAddress.addressLine2,
      district: cart[0]?.CartShippingAddress.district,
      state: cart[0]?.CartShippingAddress.state,
      country: cart[0]?.CartShippingAddress.country,
      pincode: cart[0]?.CartShippingAddress.pincode,
      contactNumber: cart[0]?.CartShippingAddress.contactNumber,
      gstin: cart[0]?.CartShippingAddress.gstin,
      deliveryDistrict: cart[0]?.CartShippingAddress.deliveryDistrict,
      deliveryState: cart[0]?.CartShippingAddress.deliveryState,
      deliveryCountry: cart[0]?.CartShippingAddress.deliveryCountry,
      deliveryPincode: cart[0]?.CartShippingAddress.deliveryPincode,
    };

    const res = await createOrder({
      orderItems,
      shippingAddress,
      paymentMethod: "RazorPay",
      itemsPrice: orderSummary.itemsPrice,
      SGST: orderSummary.sgstTotal,
      CGST: orderSummary.cgstTotal,
      totalPrice: orderSummary.totalPrice
    }).unwrap();

    const options = {
      key: razorpayKey,
      amount: orderSummary.totalPrice * 100, 
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
        {cart.length === 0 ? (
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
                  <th className="table-header">CGST</th>
                  <th className="table-header">SGST</th>
                  <th className="table-header">Total</th>
                </tr>
              </thead>

              <tbody>
                {cart.map((item, index) => {
                  const itemPrice = item.Products.price * item.quantity;
                  const itemSGST = (itemPrice * item.Products.SGST) / 100;
                  const itemCGST = (itemPrice * item.Products.CGST) / 100;
                  const itemTotal = itemPrice + itemSGST + itemCGST;

                  return (
                    <tr key={index} className="table-row">
                      <td className="table-cell">
                        <img
                          src={getImage(
                            item?.Products?.ProductImages[0]?.image_name,
                            "ProductImage"
                          )}
                          alt={item.name}
                          className="product-thumbnail"
                        />
                      </td>
                      <td className="table-cell">
                        <Link
                          to={`/product/${item.product_id}`}
                          className="product-link"
                        >
                          {item.Products?.name}
                        </Link>
                      </td>
                      <td className="table-cell">{item.quantity}</td>
                      <td className="table-cell">
                        {formatCurrency(item.Products?.price)}
                      </td>
                      <td className="table-cell">
                        {formatCurrency(itemCGST)} ({item.Products?.CGST}%)
                      </td>
                      <td className="table-cell">
                        {formatCurrency(itemSGST)} ({item.Products?.SGST}%)
                      </td>
                      <td className="table-cell">
                        {formatCurrency(itemTotal)}
                      </td>
                    </tr>
                  );
                })}
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
                <span className="price-label">Items Price: </span>
                <span className="info-text">
                  {formatCurrency(orderSummary.itemsPrice)}
                </span>
              </li>
              <li className="price-item">
                <span className="price-label">SGST: </span>
                <span className="info-text">
                  {formatCurrency(orderSummary.sgstTotal)}
                </span>
              </li>
              <li className="price-item">
                <span className="price-label">CGST: </span>
                <span className="info-text">
                  {formatCurrency(orderSummary.cgstTotal)}
                </span>
              </li>
              <li className="price-item">
                <span className="price-label">Total: </span>
                <span className="info-text">
                  {formatCurrency(orderSummary.totalPrice)}
                </span>
              </li>
            </ul>

            {error && <Message variant="danger">{error.data.message}</Message>}

            <div className="shipping-info">
              <h4 className="title text-animation">Shipping</h4>
              <p className="info-text">
                <strong>Address:</strong>{" "}
                {cart[0]?.CartShippingAddress.addressLine1},
                {cart[0]?.CartShippingAddress.addressLine2},{" "}
                {cart[0]?.CartShippingAddress.district},
                {cart[0]?.CartShippingAddress.country}-{" "}
                {cart[0]?.CartShippingAddress.pincode},{" "}
                {cart[0]?.CartShippingAddress.state}
              </p>
              <p className="info-text">
                <strong>Contact Number:</strong>{" "}
                {cart[0]?.CartShippingAddress.contactNumber}
              </p>

              <h4 className="title text-animation">Delivery Details</h4>
              <p className="info-text">
                <strong>Address:</strong>{" "}
                {cart[0]?.CartShippingAddress.deliveryDistrict},
                {cart[0]?.CartShippingAddress.deliveryCountry}-,
                {cart[0]?.CartShippingAddress.deliveryPincode},{" "}
                {cart[0]?.CartShippingAddress.deliveryState}
              </p>
            </div>

            <div className="payment-info">
              <h4 className="title text-animation">Payment Method</h4>
              <p className="info-text">
                <strong>Method:</strong> RazorPay
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
