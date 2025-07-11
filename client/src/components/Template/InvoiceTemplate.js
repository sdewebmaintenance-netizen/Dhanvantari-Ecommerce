import formatCurrency from "../../Utils/FormatCurrency";
import formatDate from "../../Utils/FormatDate";
import formatTime from "../../Utils/FormatTime";
import toTitleCase from "../../Utils/ToTiltleCase";
import Signature from "../../assets/images/Logo/Signature-Template.png";
import Dhanvantari from "../../assets/images/Logo/Dhanvantari-God.png";
const converter = require("number-to-words");

const InvoiceTemplate = ({ order }) => {
  console.log("invoi", order)
  const isWithinTamilNadu = () => {
    const shippingAddress = order.OrderShippingAddress;
    const stateToCheck = shippingAddress.deliveryState
      ? shippingAddress.deliveryState
      : shippingAddress.state;

    return stateToCheck === "TN";
  };

  const withinTN = isWithinTamilNadu();

  const calculateItemTotals = () => {
    return order.orderItems.map((item) => {
      const price = item.OrderItemProduct.price;
      const quantity = item.qty;
      const discount = item.OrderDiscount?.pricetobereduced || 0;

      const discountedPrice = price - discount;
      const itemPrice = discountedPrice * quantity;

      const itemSGST = withinTN
        ? (itemPrice * item.OrderItemProduct.SGST) / 100
        : 0;
      const itemCGST = withinTN
        ? (itemPrice * item.OrderItemProduct.CGST) / 100
        : 0;
      const itemIGST = !withinTN
        ? (itemPrice * item.OrderItemProduct.IGST) / 100
        : 0;
      const itemTotal = itemPrice + itemSGST + itemCGST + itemIGST;

      return {
        ...item,
        itemPrice,
        itemSGST,
        itemCGST,
        itemIGST,
        itemTotal,
      };
    });
  };

  const itemsWithTotals = calculateItemTotals();

  const subtotal = itemsWithTotals.reduce(
    (sum, item) => sum + item.itemPrice,
    0
  );

  const sgstTotal = itemsWithTotals.reduce(
    (sum, item) => sum + item.itemSGST,
    0
  );
  const cgstTotal = itemsWithTotals.reduce(
    (sum, item) => sum + item.itemCGST,
    0
  );
  const igstTotal = itemsWithTotals.reduce(
    (sum, item) => sum + item.itemIGST,
    0
  );

  const taxTotal = withinTN ? sgstTotal + cgstTotal : igstTotal;
  const grandTotal = subtotal + taxTotal;

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <div className="invoice-content">
          <h1>Sri Dhanvantari Exports</h1>
          <p>Dealing with All kinds of Food Starch of Products of</p>
          <p>Tapioca, Maize, Potato and Sabudana Sago items</p>
          <p>Phone: 9943760055</p>
          <p>Email: srdhanvantariexports@gmail.com</p>
          <p>GSTIN: 3382LRP29211220</p>
          <p>State: 33-Tamil Nadu</p>
        </div>
        <img src={Dhanvantari} alt={"Dhanvanatri"} className="Logo-pdf" />
      </div>

      <div className="invoice-title">
        <h2>Tax Invoice</h2>
        {withinTN ? (
          <p className="tax-note">SGST & CGST Applicable (Within Tamil Nadu)</p>
        ) : (
          <p className="tax-note">IGST Applicable (Outside Tamil Nadu)</p>
        )}
      </div>

      <div className="details-section">
        <div className="bill-to">
          <h6>Bill To</h6>
          <p>{order.OrderUser.username}</p>
          <p>
            {order.OrderShippingAddress.addressLine1},{" "}
            {order.OrderShippingAddress.district},{" "}
            {order.OrderShippingAddress.country} -{" "}
            {order.OrderShippingAddress.pincode},{" "}
            {order.OrderShippingAddress.state}{" "}
          </p>
          <p>Contact No.: {order.OrderShippingAddress.contactNumber}</p>
          <p>GSTIN Number: {order.OrderShippingAddress.gstin}</p>
          <p>State: {order.OrderShippingAddress.state}</p>
        </div>

        <div className="transport-details">
          <h6>Transportation Details</h6>
          <p>Transport Name: {order.OrderShippingAddress.transportation}</p>
          <p>
            Vehicle Number:{" "}
            {order.OrderShippingAddress.vehicleNumber
              ? order.OrderShippingAddress.vehicleNumber
              : "-"}
          </p>
          <p>
            Delivery location:
            {order.OrderShippingAddress.deliveryDistrict},{" "}
            {order.OrderShippingAddress.deliveryCountry} -{" "}
            {order.OrderShippingAddress.deliveryPincode},{" "}
            {order.OrderShippingAddress.deliveryState}{" "}
          </p>
        </div>

        <div className="invoice-details">
          <h6>Invoice Details</h6>
          <p>Invoice No.: {order.id}</p>
          <p>Date: {formatDate(order.createdAt, "dd-MM-yyyy")}</p>
          <p>Time: {formatTime(order.createdAt, "hh:mm a")}</p>
          <p>
            Place of Supply:{" "}
            {order.OrderShippingAddress.deliveryState ||
              order.OrderShippingAddress.state}
          </p>
        </div>
      </div>

      <table className="items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item name</th>
            <th>HSN/SAC</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Price/unit</th>
            <th>GST</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {itemsWithTotals.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.OrderItemProduct.hsnSac}</td>
              <td>{item.qty}</td>
              <td>Bag</td>
              <td>{formatCurrency(item.OrderItemProduct.price)}</td>
              <td>
                {withinTN
                  ? `SGST ${item.OrderItemProduct.SGST}% + CGST ${
                      item.OrderItemProduct.CGST
                    }% = 
                  ${item.OrderItemProduct.SGST + item.OrderItemProduct.CGST}%`
                  : `IGST ${item.OrderItemProduct.IGST}%`}
              </td>
              <td>{formatCurrency(item.itemTotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">Total</td>
            <td>{order.orderItems.reduce((sum, item) => sum + item.qty, 0)}</td>
            <td></td>
            <td></td>
            <td>{formatCurrency(taxTotal)}</td>
            <td>{formatCurrency(grandTotal)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="invoice-footer">
        <div className="amount-words">
          <p style={{ fontWeight: "700" }}>Invoice Amount in Words</p>
          <p>
            {toTitleCase(converter.toWords(Math.floor(grandTotal)))} Rupees Only
          </p>

          <p style={{ fontWeight: "700" }}>Terms And Conditions</p>
          <ul  className="invoice-conditions">
            <li>Goods once sold shall not be taken back.</li>
            <li>Our responsibility ceases once goods leave our factory.</li>
            <li>Subject to Salem jurisdiction.</li>
            <li>
              We do not take responsibility for transportation payments. The
              buyer should deal directly with the transporter.
            </li>
            <li>
              On arrival of goods, any damage or discrepancy in quality must be
              reported by the buyer within&nbsp;7&nbsp;days&nbsp;(
              <a
                href="mailto:sridhanvantariexports@gmail.com"
                className="text-link"
              >
                sridhanvantariexports@gmail.com
              </a>
              ).
            </li>
          </ul>
        </div>

        <div className="amount-breakdown">
          <div className="breakdown-row">
            <span>Sub Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {withinTN ? (
            <>
              <div className="breakdown-row">
                <span>
                  SGST @ {order.orderItems[0]?.OrderItemProduct?.SGST || 6}%
                </span>
                <span>{formatCurrency(sgstTotal)}</span>
              </div>
              <div className="breakdown-row">
                <span>
                  CGST @ {order.orderItems[0]?.OrderItemProduct?.CGST || 6}%
                </span>
                <span>{formatCurrency(cgstTotal)}</span>
              </div>
            </>
          ) : (
            <div className="breakdown-row">
              <span>
                IGST @ {order.orderItems[0]?.OrderItemProduct?.IGST || 12}%
              </span>
              <span>{formatCurrency(igstTotal)}</span>
            </div>
          )}
          <div className="total breakdown-row">
            <span>Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="signature">
        <img src={Signature} alt="Signature" className="signature-picture" />
        <p>Authorized Signatory</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
