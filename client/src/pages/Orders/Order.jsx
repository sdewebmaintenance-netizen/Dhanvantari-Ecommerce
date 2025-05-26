import { Link, useParams } from "react-router-dom";
import Messsage from "../../components/Common/Message";
import Loader from "../../components/Common/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from "../../redux/api/orderApiSlice";
import { useGetUserInfoQuery } from "../../redux/api/usersApiSlice";
import getImage from "../../Utils/GetImage";
import formatDate from "../../Utils/FormatTime";
import { useRef } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import InvoiceTemplate from "../../components/Template/InvoiceTemplate";
import formatCurrency from "../../Utils/FormatCurrency";

const Order = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const invoiceRef = useRef();

  const handleDownloadInvoice = () => {
    const invoiceElement = invoiceRef.current;

    toPng(invoiceElement)
      .then((dataUrl) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice_${orderId}.pdf`);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  console.log("1 order", order);

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  console.log("3 order", deliverOrder);

  const { data: userInfo } = useGetUserInfoQuery();

  console.log("4 order", userInfo);

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };
  console.log("orrooror", order);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <>
      <div style={{ position: "absolute", left: "-9999px" }}>
        <div ref={invoiceRef}>
          <InvoiceTemplate order={order} />
        </div>
      </div>
      <div className="pdf-Container">
        <div className="pdf">
          <button
            onClick={handleDownloadInvoice}
            className="btn-customized"
            style={{ marginTop: "1rem", width: "100%" }}
          >
            Download Invoice as PDF
          </button>
        </div>
      </div>

      <div className="place-order-container">
        <div className="order-items-section">
          <div className="order-items-container">
            {order.orderItems.length === 0 ? (
              <Messsage>Order is empty</Messsage>
            ) : (
              <div className="order-items-table-container">
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th className="order-table-header">Image</th>
                      <th className="order-table-header">Product</th>
                      <th className="order-table-header text-center">
                        Quantity
                      </th>
                      <th className="order-table-header">Unit Price</th>
                      <th className="order-table-header">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.orderItems.map((item, index) => (
                      <tr key={index} className="order-table-row">
                        <td className="order-table-cell">
                          <img
                            src={getImage(item?.image)}
                            alt={item.name}
                            className="order-item-image"
                          />
                        </td>

                        <td className="order-table-cell">
                          <Link
                            to={`/product/${item.product_id}`}
                            className="order-item-link"
                          >
                            {item.name}
                          </Link>
                        </td>

                        <td className="order-table-cell text-center">
                          {item.qty}
                        </td>
                        <td className="order-table-cell text-center">
                          {formatCurrency(item?.price)}
                        </td>
                        <td className="order-table-cell text-center">
                          {formatCurrency(item.qty * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="order-summary-section">
          <div className="shipping-info-container">
            <h2 className="title text-animation">Shipping</h2>
            <p className="order-info-item">
              Name:{" "}
              <strong className="highlight-text">
                {" "}
                {order.OrderUser.username}
              </strong>
            </p>

            <p className="order-info-item">
              Email:{" "}
              <strong className="highlight-text">
                {" "}
                {order.OrderUser.email}
              </strong>
            </p>

            <p className="order-info-item">
              Address:{" "}
              <strong className="highlight-text">
                {" "}
                {order.OrderShippingAddress.address},{" "}
                {order.OrderShippingAddress.city}{" "}
                {order.OrderShippingAddress.postalCode},{" "}
                {order.OrderShippingAddress.country}
              </strong>
            </p>

            <p className="order-info-item">
              Method:{" "}
              <strong className="highlight-text">{order.paymentMethod}</strong>
            </p>

            {order.isPaid ? (
              <Messsage variant="success">
                Paid on {formatDate(order.paidAt)}
              </Messsage>
            ) : (
              <Messsage variant="danger">Not paid</Messsage>
            )}
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h2 className="title text-animation">Order Summary</h2>
            <div className="price-summary-item">
              <span>Items</span>
              <span>{formatCurrency(order?.itemsPrice)}</span>
            </div>
            <div className="price-summary-item">
              <span>Shipping</span>
              <span>
                {formatCurrency(order?.itemsPrice)}

                {order.shippingPrice}
              </span>
            </div>
            <div className="price-summary-item">
              <span>Tax</span>
              <span>{formatCurrency(order?.taxPrice)}</span>
            </div>
            <div className="price-summary-item">
              <span>Total</span>
              <span>{formatCurrency(order?.totalPrice)}</span>
            </div>
          </div>
          {loadingDeliver && <Loader />}
          {userInfo &&
            userInfo.isAdmin &&
            order.isPaid &&
            !order.isDelivered && (
              <div className="deliver-button-container">
                <button
                  type="button"
                  className="deliver-button"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default Order;
