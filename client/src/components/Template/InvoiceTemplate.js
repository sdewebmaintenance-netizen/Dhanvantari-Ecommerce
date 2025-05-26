import formatCurrency from "../../Utils/FormatCurrency";
import formatDate from "../../Utils/FormatTime";
import toTitleCase from "../../Utils/ToTiltleCase";
import Signature from "../../assets/images/Signature-Template.png";
import Dhanvantari from "../../assets/images/Dhanvantari-God.png";
const converter = require("number-to-words");

const InvoiceTemplate = ({ order }) => {
  const subtotal = order.itemsPrice;
  const gstAmount = order.taxPrice;
  const sgst = gstAmount / 2;
  const cgst = gstAmount / 2;
  const total = order.totalPrice;

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
        <img src={Dhanvantari} alt={"Dhanvanatri"} className="Logo-pdf"/>
      </div>

      <div className="invoice-title">
        <h2>Tax Invoice</h2>
      </div>

      <div className="details-section">
        <div className="bill-to">
          <h6>Bill To</h6>
          <p>{order.OrderUser.username}</p>
          <p>{order.OrderShippingAddress.address}</p>
          <p>
            {order.OrderShippingAddress.city}{" "}
            {order.OrderShippingAddress.postalCode}
          </p>
          <p>Contact No.: [Customer Phone]</p>
          <p>GSTIN Number: [Customer GSTIN]</p>
          <p>State: [Customer State]</p>
        </div>

        <div className="transport-details">
          <h6>Transportation Details</h6>
          <p>Transport Name: Mettur Transport MSS</p>
          <p>Vehicle Number: </p>
          <p>Delivery location: RedHills, Chennai.</p>
        </div>

        <div className="invoice-details">
          <h6>Invoice Details</h6>
          <p>Invoice No.: {order.id}</p>
          <p>Date: {formatDate(order.createdAt, "dd-MM-yyyy")}</p>
          <p>Time: {formatDate(order.createdAt, "hh:mm a")}</p>
          <p>Place of Supply: 33-Tamil Nadu</p>
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
          {order.orderItems.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>[Product HSN/SAC]</td>
              <td>{item.qty}</td>
              <td>Bag</td>
              <td>{formatCurrency(item.price)}</td>
              <td>
                {" "}
                {formatCurrency(item.price * item.qty * 0.12)}
                (12.0%)
              </td>
              <td> {formatCurrency(item.price * item.qty)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">Total</td>
            <td>{order.orderItems.reduce((sum, item) => sum + item.qty, 0)}</td>
            <td></td>
            <td></td>
            <td> {formatCurrency(gstAmount)}</td>
            <td>{formatCurrency(total)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="invoice-footer">
        <div className="amount-words">
          <p style={{ fontWeight: "700" }}>Invoice Amount in Words</p>
          <p>{toTitleCase(converter.toWords(Math.floor(total)))} Rupees Only</p>

          <p style={{ fontWeight: "700" }}>Terms And Conditions</p>
          <p>Thank you for doing business with us.</p>
        </div>

        <div className="amount-breakdown">
          <div className="breakdown-row">
            <span>Sub Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="breakdown-row">
            <span>SGST@ 6.0%</span>
            <span> {formatCurrency(sgst)}</span>
          </div>
          <div className="breakdown-row">
            <span>CGST@ 6.0%</span>
            <span>{formatCurrency(cgst)}</span>
          </div>
          <div className=" total breakdown-row">
            <span>Total</span>
            <span> {formatCurrency(total)}</span>
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
