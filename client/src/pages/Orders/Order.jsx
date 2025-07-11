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
import { useRequestInvoiceMutation } from "../../redux/api/productApiSlice";
import getImage from "../../Utils/GetImage";
import formatDate from "../../Utils/FormatDate";
import { useRef } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import InvoiceTemplate from "../../components/Template/InvoiceTemplate";
import formatCurrency from "../../Utils/FormatCurrency";
import formatTime from "../../Utils/FormatTime";
import { FaTag } from "react-icons/fa";

const Order = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [requestInvoice] = useRequestInvoiceMutation();
  const invoiceRef = useRef();

  const isWithinTamilNadu = () => {
    const shippingAddress = order.OrderShippingAddress;
    const stateToCheck = shippingAddress.deliveryState 
      ? shippingAddress.deliveryState 
      : shippingAddress.state;
    
    return stateToCheck === "TN"; 
  };

  const generateAndSaveInvoice = async () => {
    const invoiceElement = invoiceRef.current;

    try {
      const dataUrl = await toPng(invoiceElement);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const pageHeight = pdf.internal.pageSize.getHeight();
      
      let heightLeft = pdfHeight;
      let position = 0;
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${formatDate(order.paidAt)}_${formatTime(
        order.paidAt
      )}_${order.OrderUser.email}.pdf`
        .replace(/\s+/g, "_")
        .replace(/:/g, "-");

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
        console.log("error");
      }
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

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { data: userInfo } = useGetUserInfoQuery();

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  const calculateItemTotal = (item) => {
    const price = item.OrderItemProduct.price;
    const quantity = item.qty;
    const discount = item.OrderDiscount?.pricetobereduced || 0;
    
    const discountedPrice = price - discount;
    const itemPrice = discountedPrice * quantity;
    
    const isTamilNadu = isWithinTamilNadu();
    const itemSGST = isTamilNadu ? (itemPrice * item.OrderItemProduct.SGST) / 100 : 0;
    const itemCGST = isTamilNadu ? (itemPrice * item.OrderItemProduct.CGST) / 100 : 0;
    const itemIGST = !isTamilNadu ? (itemPrice * item.OrderItemProduct.IGST) / 100 : 0;
    
    return {
      originalPrice: price * quantity,
      discountedPrice: itemPrice,
      sgst: itemSGST,
      cgst: itemCGST,
      igst: itemIGST,
      total: itemPrice + itemSGST + itemCGST + itemIGST,
      discountAmount: discount * quantity
    };
  };

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
        <div>
          <Link to="/user-orders" className="btn-customized">
            Go Back
          </Link>
        </div>

        <div>
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
                      <th className="order-table-header">Discount</th>
                      {isWithinTamilNadu() ? (
                        <>
                          <th className="order-table-header">CGST</th>
                          <th className="order-table-header">SGST</th>
                        </>
                      ) : (
                        <th className="order-table-header">IGST</th>
                      )}
                      <th className="order-table-header text-center">Weight</th>
                      <th className="order-table-header">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.orderItems.map((item, index) => {
                      const itemTotal = calculateItemTotal(item);
                      return (
                        <tr key={index} className="order-table-row">
                          <td className="order-table-cell">
                            <img
                              src={getImage(
                                item?.OrderItemProduct?.ProductImages[0]
                                  ?.image_name,
                                "ProductImage"
                              )}
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
                              {item.OrderDiscount && (
                                <div className="discount-badge">
                                  <FaTag style={{ marginRight: "5px", color: "green" }} />
                                  Buy {item.OrderDiscount.qty}+, Save {formatCurrency(item.OrderDiscount.pricetobereduced)} per unit
                                </div>
                              )}
                            </Link>
                          </td>

                          <td className="order-table-cell text-center">
                            {item.qty}
                          </td>
                          <td className="order-table-cell text-center">
                            {formatCurrency(item.OrderItemProduct.price)}
                          </td>
                          <td className="order-table-cell text-center">
                            {item.OrderDiscount ? (
                              <>
                                <span style={{ textDecoration: "line-through" }}>
                                  {formatCurrency(itemTotal.originalPrice)}
                                </span>
                                <br />
                                <span style={{ color: "green" }}>
                                  -{formatCurrency(itemTotal.discountAmount)}
                                </span>
                              </>
                            ) : (
                              "-"
                            )}
                          </td>
                          {isWithinTamilNadu() ? (
                            <>
                              <td className="order-table-cell text-center">
                                {formatCurrency(itemTotal.cgst)} ({item.OrderItemProduct.CGST}%)
                              </td>
                              <td className="order-table-cell text-center">
                                {formatCurrency(itemTotal.sgst)} ({item.OrderItemProduct.SGST}%)
                              </td>
                            </>
                          ) : (
                            <td className="order-table-cell text-center">
                              {formatCurrency(itemTotal.igst)} ({item.OrderItemProduct.IGST}%)
                            </td>
                          )}
                          <td className="order-table-cell text-center">
                            {item.OrderItemProduct.weight}
                          </td>
                          <td className="order-table-cell text-center">
                            {formatCurrency(itemTotal.total)}
                          </td>
                        </tr>
                      );
                    })}
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
                {order.OrderShippingAddress.addressLine1},{" "}
                {order.OrderShippingAddress.district} -{" "}
                {order.OrderShippingAddress.pincode},{" "}
                {order.OrderShippingAddress.country},{" "}
                {order.OrderShippingAddress.state}
              </strong>
            </p>
            <p className="order-info-item">
              Contact Number :{" "}
              <strong className="highlight-text">
                {order.OrderShippingAddress.contactNumber}
              </strong>
            </p>

            {order.OrderShippingAddress.deliveryDistrict ? (
              <p className="order-info-item">
                Delivery:{" "}
                <strong className="highlight-text">
                  {order.OrderShippingAddress.deliveryDistrict} -{" "}
                  {order.OrderShippingAddress.deliveryPincode},{" "}
                  {order.OrderShippingAddress.deliveryCountry},{" "}
                  {order.OrderShippingAddress.deliveryState},
                </strong>
              </p>
            ) : (
              <></>
            )}

            <p className="order-info-item">
              Tranportation:{" "}
              <strong className="highlight-text">
                {order.OrderShippingAddress.transportation},{" "}
                {order.OrderShippingAddress.vehicleNumber
                  ? order.OrderShippingAddress.vehicleNumber
                  : ""}
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
            
            {order.orderItems.some(item => item.OrderDiscount) && (
              <div className="price-summary-item discount-item">
                <span>
                  <FaTag style={{ marginRight: "5px", color: "green" }} />
                  Total Discounts
                </span>
                <span style={{ color: "green" }}>
                  -{formatCurrency(
                    order.orderItems.reduce((total, item) => {
                      return total + (item.OrderDiscount?.pricetobereduced || 0) * item.qty;
                    }, 0)
                  )}
                </span>
              </div>
            )}
            
            {isWithinTamilNadu() ? (
              <>
                <div className="price-summary-item">
                  <span>SGST</span>
                  <span>{formatCurrency(order?.SGST)}</span>
                </div>
                <div className="price-summary-item">
                  <span>CGST</span>
                  <span>{formatCurrency(order?.CGST)}</span>
                </div>
              </>
            ) : (
              <div className="price-summary-item">
                <span>IGST</span>
                <span>{formatCurrency(order?.IGST)}</span>
              </div>
            )}

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