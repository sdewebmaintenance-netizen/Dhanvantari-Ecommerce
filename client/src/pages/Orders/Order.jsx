import { useEffect } from "react";
import { saveAs } from "file-saver";
import { Link, useParams } from "react-router-dom";
import Messsage from "../../components/Common/Message";
import Loader from "../../components/Common/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from "../../redux/api/orderApiSlice";
import { useGetUserInfoQuery } from "../../redux/api/usersApiSlice";
import {
  useRequestInvoiceMutation,
} from "../../redux/api/productApiSlice";
import getImage from "../../Utils/GetImage";
import formatDate from "../../Utils/FormatDate";
import { useRef } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import InvoiceTemplate from "../../components/Template/InvoiceTemplate";
import formatCurrency from "../../Utils/FormatCurrency";
import formatTime from "../../Utils/FormatTime";

const Order = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  console.log("sgiuasf", order)
  const [requestInvoice] = useRequestInvoiceMutation();
  const invoiceRef = useRef();

  const generateAndSaveInvoice = async () => {
    const invoiceElement = invoiceRef.current;

    try {
      const dataUrl = await toPng(invoiceElement);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Generate filename
      const fileName = `${formatDate(order.paidAt)}_${formatTime(
        order.paidAt
      )}_${order.OrderUser.email}.pdf`
        .replace(/\s+/g, "_")
        .replace(/:/g, "-");

      // Save the PDF
      const pdfBlob = pdf.output("blob");
      saveAs(pdfBlob, fileName);

      return pdf.output("datauristring");
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      await generateAndSaveInvoice();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sendInvoiceEmail = async () => {
    try {
      const pdfDataUrl = await generateAndSaveInvoice();

      const orderDetails = {
        orderId: order._id,
        email: order.OrderUser.email,
        userName: order.OrderUser.username,
        pdfDataUrl: pdfDataUrl,
        orderDetails: {
          orderNumber: order._id,
          items: order.orderItems.map((item) => ({
            name: item.name,
            quantity: item.qty,
            unit: "unit",
            price: formatCurrency(item.price),
          })),
          shippingCost: formatCurrency(order.shippingPrice),
          totalAmount: formatCurrency(order.totalPrice),
          paymentStatus: order.isPaid ? "Paid" : "Pending",
          expectedShipment: "Within 5-7 business days",
        },
      };

      const result = await requestInvoice(orderDetails).unwrap();

      if (!result.ok) {
        console.log("error")
      };

      console.log("Invoice email sent successfully");
    } catch (error) {
      console.error("Error sending invoice email:", error);
    }
  };

  useEffect(() => {
    const redirectUrl = localStorage.getItem("redirect_url");
    if (redirectUrl === "Order_Placed" && order && order.isPaid) {
      sendInvoiceEmail();
      /* localStorage.removeItem("redirect_url"); */
    }
  }, [order]);

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
                      <th className="order-table-header text-center">
                        Weight
                      </th>
                      <th className="order-table-header">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.orderItems.map((item, index) => (
                      <tr key={index} className="order-table-row">
                        <td className="order-table-cell">
                          <img
                            src={getImage(item?.OrderItemProduct?.ProductImages[0]?.image_name, "ProductImage")}
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
                          {formatCurrency(item?.OrderItemProduct.price)}
                        </td>
                        <td className="order-table-cell text-center">
                          {item.OrderItemProduct.weight}
                        </td>
                        <td className="order-table-cell text-center">
                          {formatCurrency(item.qty * item.OrderItemProduct.price)}
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
                Paid on {formatDate(order.paidAt)} {formatTime(order.paidAt)}
              </Messsage>
            ) : (
              <Messsage variant="danger">Not paid</Messsage>
            )}
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h2 className="title text-animation">Order Summary</h2>
            <div className="price-summary-item">
              <span>Items</span>
              <span>{formatCurrency(order?.itemsUnitPrice)}</span>
            </div>
            <div className="price-summary-item">
              <span>SGST</span>
              <span>
                {formatCurrency(order?.SGST)}
              </span>
            </div>
             <div className="price-summary-item">
              <span>CGST</span>
              <span>
                {formatCurrency(order?.CGST)}
              </span>
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
