import { Link, useNavigate } from "react-router-dom";
import Message from "../../components/Common/Message";
import ProgressSteps from "../../components/Protected_Routes/User/Cart/ProgressSteps";
import Loader from "../../components/Common/Loader";

import { useDispatch } from "react-redux";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

import {
  useCreateRazorPayOrderMutation,
  useDeleteOrderMutation,
  useGetRazorPayKeyIdQuery,
  useCreateOrderMutation,
  useOrderConfirmationViaEmailsMutation,
} from "../../redux/api/orderApiSlice";
import formatCurrency from "../../Utils/FormatCurrency";
import { useFetchCartForUserQuery } from "../../redux/api/cartApiSlice";
import { useEffect, useState } from "react";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const { data: cart = [], refetch } = useFetchCartForUserQuery();
  const [order, setOrder] = useState();

  const [loading, setLoading] = useState(false);
  console.log("Sss", cart);

  useEffect(() => {
    refetch();
  }, []);

  const dispatch = useDispatch();

  const [createRazorPayOrder, { isLoading, error }] =
    useCreateRazorPayOrderMutation();
  const [orderConfirmationViaEmails] = useOrderConfirmationViaEmailsMutation();
  const [createOrder] = useCreateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const [paymentMethod, setPaymentMethod] = useState("");

  const { data: razorpayKey } = useGetRazorPayKeyIdQuery();

  const calculateOrderSummary = () => {
    if (!cart || cart.length === 0) return {};

    let itemsPrice = 0;
    let sgstTotal = 0;
    let cgstTotal = 0;
    let igstTotal = 0;
    let taxPrice = 0;
    let totalPrice = 0;
    let totalDiscount = 0;
    let originalItemsPrice = 0;

    const isSameState = cart[0]?.CartShippingAddress?.deliveryState === "TN";

    cart.forEach((item) => {
      const originalItemPrice = item.Products.price * item.quantity;
      originalItemsPrice += originalItemPrice;

      const productDiscount = item.Products?.ProductDiscount;
      const hasDiscount =
        productDiscount && item.quantity >= productDiscount.qty;

      const itemPrice = hasDiscount
        ? (item.Products.price - productDiscount.pricetobereduced) *
          item.quantity
        : originalItemPrice;

      let itemSGST = 0;
      let itemCGST = 0;
      let itemIGST = 0;

      if (isSameState) {
        itemCGST = (itemPrice * item.Products.CGST) / 100;
        itemSGST = (itemPrice * item.Products.SGST) / 100;
      } else {
        itemIGST = (itemPrice * item.Products.IGST) / 100;
      }

      itemsPrice += itemPrice;
      sgstTotal += itemSGST;
      cgstTotal += itemCGST;
      igstTotal += itemIGST;

      if (hasDiscount) {
        totalDiscount += productDiscount.pricetobereduced * item.quantity;
      }
    });

    taxPrice = isSameState ? sgstTotal + cgstTotal : igstTotal;
    totalPrice = itemsPrice + taxPrice;

    return {
      itemsPrice,
      sgstTotal,
      cgstTotal,
      igstTotal,
      taxPrice,
      totalPrice,
      totalDiscount,
      originalItemsPrice,
      isSameState,
    };
  };
  const orderSummary = calculateOrderSummary();

  /* const placeOrderHandler = async () => {
    try {
      const orderItems = cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.Products.price,
        CGST: item.Products.CGST,
        SGST: item.Products.SGST,
        IGST: item.Products.IGST,
        name: item.Products.name,
        image: item.Products.ProductImages[0]?.image_name,
      }));
      const appliedDiscounts = cart
        .map((item) => {
          const productDiscount = item.Products?.ProductDiscount;
          const hasDiscount =
            productDiscount && item.quantity >= productDiscount.qty;

          return hasDiscount
            ? {
                product_id: item.product_id,
                discount_id: productDiscount.id,
                discount_amount: productDiscount.pricetobereduced,
                quantity_required: productDiscount.qty,
              }
            : null;
        })
        .filter(Boolean);

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

      const res = await createRazorPayOrder({
        totalPrice: orderSummary.totalPrice,
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
            setLoading(true);
            const createdOrder = await createOrder({
              orderItems,
              shippingAddress,
              paymentMethod: paymentMethod,
              itemsPrice: orderSummary.itemsPrice,
              SGST: orderSummary.sgstTotal,
              CGST: orderSummary.cgstTotal,
              IGST: orderSummary.igstTotal,
              totalPrice: orderSummary.totalPrice,
              appliedDiscounts,
              paymentId: res.payment.id,
            }).unwrap();
            setOrder(createdOrder.order);
            localStorage.setItem("redirect_url", "Order_Placed");
            await orderConfirmationViaEmails({
              order: createdOrder.order,
            }).unwrap();
            setLoading(false);
            alert("Payment successful!");
            console.log("shsssa", createdOrder.order);
            navigate(`/order/${createdOrder.order.id}`);
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
      alert(error);
    }
  }; */

  const placeOrderHandler = async () => {
    try {
      const orderItems = cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.Products.price,
        CGST: item.Products.CGST,
        SGST: item.Products.SGST,
        IGST: item.Products.IGST,
        name: item.Products.name,
        image: item.Products.ProductImages[0]?.image_name,
      }));

      const appliedDiscounts = cart
        .map((item) => {
          const productDiscount = item.Products?.ProductDiscount;
          const hasDiscount =
            productDiscount && item.quantity >= productDiscount.qty;

          return hasDiscount
            ? {
                product_id: item.product_id,
                discount_id: productDiscount.id,
                discount_amount: productDiscount.pricetobereduced,
                quantity_required: productDiscount.qty,
              }
            : null;
        })
        .filter(Boolean);

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

      if (paymentMethod === "Pay_Direct") {
        setLoading(true);
        const createdOrder = await createOrder({
          orderItems,
          shippingAddress,
          paymentMethod: paymentMethod,
          itemsPrice: orderSummary.itemsPrice,
          SGST: orderSummary.sgstTotal,
          CGST: orderSummary.cgstTotal,
          IGST: orderSummary.igstTotal,
          totalPrice: orderSummary.totalPrice,
          appliedDiscounts,
          paymentId: null,
        }).unwrap();

        setOrder(createdOrder.order);
        localStorage.setItem("redirect_url", "Order_Placed");

        await orderConfirmationViaEmails({
          order: createdOrder.order,
        }).unwrap();

        setLoading(false);
       dispatch(clearCartItems()); 
        alert("Order placed successfully via Pay Direct!");
        navigate(`/order/${createdOrder.order.id}`);
      } else {
        const res = await createRazorPayOrder({
          totalPrice: orderSummary.totalPrice,
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
              setLoading(true);
              const createdOrder = await createOrder({
                orderItems,
                shippingAddress,
                paymentMethod: paymentMethod,
                itemsPrice: orderSummary.itemsPrice,
                SGST: orderSummary.sgstTotal,
                CGST: orderSummary.cgstTotal,
                IGST: orderSummary.igstTotal,
                totalPrice: orderSummary.totalPrice,
                appliedDiscounts,
                paymentId: res.payment.id,
              }).unwrap();

              setOrder(createdOrder.order);
              localStorage.setItem("redirect_url", "Order_Placed");

              await orderConfirmationViaEmails({
                order: createdOrder.order,
              }).unwrap();

              setLoading(false);
              dispatch(clearCartItems()); 
              alert("Payment successful!");
              navigate(`/order/${createdOrder.order.id}`);
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
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const renderCartItems = () => {
    const isSameState = cart[0]?.CartShippingAddress?.deliveryState === "TN";

    return cart.map((item, index) => {
      const productDiscount = item.Products?.ProductDiscount;
      const hasDiscount =
        productDiscount && item.quantity >= productDiscount.qty;

      const originalItemPrice = item.Products.price * item.quantity;
      const itemPrice = hasDiscount
        ? (item.Products.price - productDiscount.pricetobereduced) *
          item.quantity
        : originalItemPrice;

      let itemSGST = 0;
      let itemCGST = 0;
      let itemIGST = 0;
      let itemTotal = 0;

      if (isSameState) {
        itemCGST = (itemPrice * item.Products.CGST) / 100;
        itemSGST = (itemPrice * item.Products.SGST) / 100;
        itemTotal = itemPrice + itemCGST + itemSGST;
      } else {
        itemIGST = (itemPrice * item.Products.IGST) / 100;
        itemTotal = itemPrice + itemIGST;
      }
      return (
        <tr key={index} className="table-row">
          <td className="table-cell">
            <img
              src={item?.Products?.ProductImages[0]?.image_url}
              alt={item.name}
              className="product-thumbnail"
            />
          </td>
          <td className="table-cell">
            <Link to={`/product/${item.product_id}`} className="product-link">
              {item.Products?.name}
              <br />{" "}
              {hasDiscount && (
                <div className="discount-badge">
                  Discount: Buy {productDiscount.qty}+, Save{" "}
                  {formatCurrency(productDiscount.pricetobereduced)} per unit
                </div>
              )}
            </Link>
          </td>
          <td className="table-cell">{item.quantity}</td>
          <td className="table-cell">
            {hasDiscount ? (
              <>
                <span
                  className="original-price"
                  style={{ textDecoration: "line-through" }}
                >
                  {formatCurrency(item.Products.price)}
                </span>
                <span className="discounted-price">
                  {formatCurrency(
                    item.Products.price - productDiscount.pricetobereduced
                  )}
                </span>
              </>
            ) : (
              formatCurrency(item.Products.price)
            )}
          </td>
          {isSameState ? (
            <>
              <td className="table-cell">
                {formatCurrency(itemCGST)} ({item.Products?.CGST}%)
              </td>
              <td className="table-cell">
                {formatCurrency(itemSGST)} ({item.Products?.SGST}%)
              </td>
            </>
          ) : (
            <td className="table-cell" colSpan="2">
              {formatCurrency(itemIGST)} (IGST {item.Products?.IGST}%)
            </td>
          )}
          <td className="table-cell">{formatCurrency(itemTotal)}</td>
        </tr>
      );
    });
  };

  console.log("orderrrrrrr", order);

  return (
    <div className="order-container">
      <ProgressSteps step1 step2 step3 />

      {isLoading || loading ? (
        <Loader />
      ) : (
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
                    {orderSummary.isSameState ? (
                      <>
                        <th className="table-header">CGST</th>
                        <th className="table-header">SGST</th>
                      </>
                    ) : (
                      <th className="table-header" colSpan="2">
                        IGST
                      </th>
                    )}
                    <th className="table-header">Total</th>
                  </tr>
                </thead>

                <tbody>{renderCartItems()}</tbody>
              </table>
            </div>
          )}

          <div className="order-summary">
            <h2
              className="title text-animation"
              style={{ marginBottom: "2rem" }}
            >
              Order Summary
            </h2>
            <div className="summary-details">
              <ul className="price-list">
                <li className="price-item">
                  <span className="price-label">Original Items Price: </span>
                  <span className="info-text">
                    {formatCurrency(orderSummary.originalItemsPrice)}
                  </span>
                </li>
                {orderSummary.totalDiscount > 0 && (
                  <li className="price-item">
                    <span className="price-label">Discount: </span>
                    <span className="info-text discount-text">
                      -{formatCurrency(orderSummary.totalDiscount)}
                    </span>
                  </li>
                )}
                <li className="price-item">
                  <span className="price-label">
                    Items Price After Discount:{" "}
                  </span>
                  <span className="info-text">
                    {formatCurrency(orderSummary.itemsPrice)}
                  </span>
                </li>
                {orderSummary.isSameState ? (
                  <>
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
                  </>
                ) : (
                  <li className="price-item">
                    <span className="price-label">IGST: </span>
                    <span className="info-text">
                      {formatCurrency(orderSummary.igstTotal)}
                    </span>
                  </li>
                )}
                <li className="price-item total-price">
                  <span className="price-label">Total: </span>
                  <span className="info-text">
                    {formatCurrency(orderSummary.totalPrice)}
                  </span>
                </li>
              </ul>

              {error && (
                <Message variant="danger">{error.data.message}</Message>
              )}

              <div className="shipping-info">
                <h4 className="title text-animation">Customer Address</h4>
                <p className="info-text">
                  <strong>Address:</strong>{" "}
                  <div className="address-text">
                  {cart[0]?.CartShippingAddress?.addressLine1},
                  {cart[0]?.CartShippingAddress?.addressLine2},{" "}
                  {cart[0]?.CartShippingAddress?.district},
                  {cart[0]?.CartShippingAddress?.country}-{" "}
                  {cart[0]?.CartShippingAddress?.pincode},{" "}
                  {cart[0]?.CartShippingAddress?.state}
                  </div>
                </p>
                <p className="info-text">
                  <strong>Contact Number:</strong>{" "}
                  {cart[0]?.CartShippingAddress?.contactNumber}
                </p>

                <h4 className="title text-animation">Shipping Details</h4>
                <p className="info-text">
                  <strong>Address:</strong>{" "}
                  <div className="address-text">
                  {cart[0]?.CartShippingAddress?.deliveryDistrict},
                  {cart[0]?.CartShippingAddress?.deliveryCountry}-,
                  {cart[0]?.CartShippingAddress?.deliveryPincode},{" "}
                  {cart[0]?.CartShippingAddress?.deliveryState}
                  </div>
                </p>
              </div>

              <div className="payment-info">
                <h4 className="title text-animation">Payment Method</h4>

                <div className="form-group same-line">
                  <input
                    type="radio"
                    value="RazorPay"
                    checked={paymentMethod === "RazorPay"}
                    onChange={() => setPaymentMethod("RazorPay")}
                    className="form-control"
                  />
                  <label className="form-label">RazorPay</label>
                </div>

                <div className="form-group same-line">
                  <input
                    type="radio"
                    value="Pay_Direct"
                    checked={paymentMethod === "Pay_Direct"}
                    onChange={() => setPaymentMethod("Pay_Direct")}
                    className="form-control"
                  />
                  <label className="form-label">
                    {" "}
                    Pay directly (G pay/phone pay : +91 9789108155 or NEFT
                    Transfer)
                  </label>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-customized"
              disabled={cart.cartItems === 0 || paymentMethod === ""}
              onClick={placeOrderHandler}
              style={{ marginTop: "2rem", width: "100%" }}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
