const EmailTemplates = {
  requestQuoteTemplate: {
    owner: (name, requesterDetails, productDetails) => `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>New Quote Request - Sridhanvantari Exports</title>
          <style>
              body {
                  background-color: #f5f5f5;
                  line-height: 1.6;
                  color: #333;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              .header {
                  background-color: #4e474a;
                  color: #fff7e6;
                  padding: 30px 20px;
                  text-align: center;
              }
              .content {
                  padding: 30px;
              }
              .details-box {
                  background: #fdf5e1;
                  border-left: 4px solid #4e474a;
                  padding: 15px;
                  margin: 20px 0;
              }
              .product-item {
                  margin-bottom: 15px;
                  padding-bottom: 15px;
                  border-bottom: 1px solid #eee;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 12px;
                  color: #777;
                  background: #f5f5f5;
              }
              .btn {
                  display: inline-block;
                  padding: 10px 20px;
                  background: #4e474a;
                  color: white !important;
                  text-decoration: none;
                  border-radius: 4px;
                  margin-top: 15px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>New Quote Request</h1>
                  <p>Sri Dhanvantari Team</p>
              </div>
              <div class="content">
                  <p>Dear ${name},</p>
                  <p>A new quote request has been submitted through our website. Please find the details below:</p>
                  
                  <div class="details-box">
                      <h3>Requester Information</h3>
                      <p><strong>Name:</strong> ${requesterDetails.name}</p>
                      <p><strong>Email:</strong> ${requesterDetails.email}</p>
                      <p><strong>Phone:</strong> ${
                        requesterDetails.phone || "Not provided"
                      }</p>
                      <p><strong>Company:</strong> ${
                        requesterDetails.company || "Not provided"
                      }</p>
                      <p><strong>Country:</strong> ${
                        requesterDetails.country || "Not provided"
                      }</p>
                  </div>
                  
                  <div class="details-box">
                      <h3>Requested Products</h3>
                      ${productDetails
                        .map(
                          (product) => `
                          <div class="product-item">
                              <p><strong>Product:</strong> ${product.name}</p>
                              <p><strong>Quantity:</strong> ${
                                product.quantity
                              }</p>
                              ${
                                product.specifications
                                  ? `<p><strong>Specifications:</strong> ${product.specifications}</p>`
                                  : ""
                              }
                          </div>
                      `
                        )
                        .join("")}
                  </div>
                  
                  <p>Please respond to this inquiry within 24 - 72 hours to maintain our service standards.</p>
                  
                  <p>Best regards,<br>Sri Dhanvantari Website Maintanance Team</p>
              </div>
              <div class="footer">
                  <p>© ${new Date().getFullYear()} Sri Dhanvantari Exports. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `,

    user: (name, productNames) => `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Quote Request Received - Sridhanvantari Exports</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background-color: #fdf5e1;
                  line-height: 1.6;
                  color: #4e474a;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #fdf5e1;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              .header {
                  background-color:rgb(78, 71, 74);
                  color: #fdf5e1;
                  padding: 30px 20px;
                  text-align: center;
              }
              .content {
                  padding: 30px;
              }
              .product-list {
                  margin: 20px 0;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 12px;
                  color:#4e474a;
                  background: #fdf5e1;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Quote Request Received</h1>
                  <p>Thank you for your interest in Sri Dhanvantari Exports</p>
              </div>
              <div class="content">
                  <p>Dear ${name},</p>
                  <p>We've successfully received your request for the following products:</p>
                  
                  <div class="product-list">
                      <ul>
                          ${productNames
                            .map((product) => `<li>${product}</li>`)
                            .join("")}
                      </ul>
                  </div>
                  
                  <p>Our team is currently processing your request and will get back to you with a detailed quote within <strong>3-5 business days</strong>.</p>
                  
                  <p>If you have any urgent requirements or additional questions, please don't hesitate to contact us directly at <a href="mailto:sales@sridhanvantariexports.com">sales@sridhanvantariexports.com</a>.</p>
                  
                  <p>Thank you for considering Sridhanvantari Exports for your needs. We look forward to serving you.</p>
                  
                  <p>Best regards,<br>Sri Dhanvantari Exports Team</p>
              </div>
              <div class="footer">
                  <p>© ${new Date().getFullYear()} Sri Dhanvantari Exports. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `,
  },

  // 2. Invoice Download - Sent to user
  invoiceDownloadTemplate: (userName, orderDetails, invoiceUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Your Invoice is Ready - Sridhanvantari Exports</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                background-color: #3498db;
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            .content {
                padding: 30px;
            }
            .order-summary {
                border: 1px solid #eee;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
            }
            .order-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            .total {
                font-weight: bold;
                margin-top: 10px;
                border-top: 2px solid #eee;
                padding-top: 10px;
            }
            .btn {
                display: inline-block;
                padding: 12px 25px;
                background-color: #3498db;
                color: white !important;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #777;
                background: #f5f5f5;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Your Invoice is Ready</h1>
                <p>Order #${orderDetails.orderNumber}</p>
            </div>
            <div class="content">
                <p>Dear ${userName},</p>
                <p>Thank you for your order with Sridhanvantari Exports. Your invoice is now available for download.</p>
                
                <div class="order-summary">
                    <h3>Order Summary</h3>
                    ${orderDetails.items
                      .map(
                        (item) => `
                        <div class="order-item">
                            <span>${item.name} (${item.quantity} ${item.unit})</span>
                            <span>${item.price}</span>
                        </div>
                    `
                      )
                      .join("")}
                    
                    <div class="order-item">
                        <span>Shipping</span>
                        <span>${orderDetails.shippingCost}</span>
                    </div>
                    
                    <div class="order-item total">
                        <span>Total Amount</span>
                        <span>${orderDetails.totalAmount}</span>
                    </div>
                </div>
                
                <p>Payment Status: <strong>${
                  orderDetails.paymentStatus
                }</strong></p>
                <p>Expected Shipment Date: <strong>${
                  orderDetails.expectedShipment
                }</strong></p>
                
                <center>
                    <a href="${invoiceUrl}" class="btn">Download Invoice</a>
                </center>
                
                <p>For your records, we've also attached a copy of this invoice to this email.</p>
                
                <p>If you have any questions about your order, please reply to this email or contact our support team at <a href="mailto:support@sridhanvantariexports.com">support@sridhanvantariexports.com</a>.</p>
                
                <p>Thank you for choosing Sridhanvantari Exports!</p>
                
                <p>Best regards,<br>Sridhanvantari Exports Team</p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Sridhanvantari Exports. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `,

  orderPlacedTemplate: (order) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>New Order – Sri Dhanvantari Exports</title>
      <style>
        body  { font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; background:#fdf5e1; line-height:1.6; color:#4e474a; }
        .container { max-width:600px; margin:0 auto; background:#fdf5e1; border-radius:8px; overflow:hidden; box-shadow:0 0 20px rgba(0,0,0,0.1); }
        .header    { background:#4e474a; color:#fdf5e1; padding:30px 20px; text-align:center; }
        .content   { padding:30px; }
        table      { width:100%; border-collapse:collapse; margin:20px 0; }
        th,td      { padding:12px; text-align:left; border-bottom:1px solid #4e474a; }
        th         { background:#fff; }
        .discount  { color:#28a745; }
        .total     { font-weight:700; }
        .footer    { text-align:center; padding:20px; font-size:12px; color:#777; background:#f5f5f5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Order #${order.orderNumber}</h1>
        </div>

        <div class="content">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${order.customer.name}</p>
          <p><strong>Email:</strong> ${order.customer.email}</p>
          <p><strong>Phone:</strong> ${order.customer.phone || "N/A"}</p>

          <h3>Shipping Address</h3>
          <p>${order.shippingAddress}</p>
          ${
            order.withinTN
              ? "<p><em>This order is within Tamil Nadu (SGST/CGST applied)</em></p>"
              : "<p><em>This order is outside Tamil Nadu (IGST applied)</em></p>"
          }

          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th><th>Qty</th><th>Original</th><th>Discount</th>
                ${
                  order.withinTN
                    ? "<th>SGST</th><th>CGST</th>"
                    : "<th>IGST</th>"
                }
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (i) => `
                <tr>
                  <td>${i.name}</td>
                  <td>${i.quantity} ${i.unit}</td>
                  <td>${i.originalPrice}</td>
                  <td class="discount">${i.discountAmount || "-"}</td>
                  ${
                    order.withinTN
                      ? `<td>${i.sgst}</td><td>${i.cgst}</td>`
                      : `<td>${i.igst}</td>`
                  }
                  <td>${i.totalPrice}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <p><strong>Subtotal:</strong> ${order.subtotal}</p>
          ${
            order.totalDiscount !== "₹0.00"
              ? `<p class="discount"><strong>Total Discount:</strong> ${order.totalDiscount}</p>`
              : ""
          }
          ${
            order.withinTN
              ? `<p><strong>SGST Total:</strong> ${order.sgstTotal}</p>
               <p><strong>CGST Total:</strong> ${order.cgstTotal}</p>`
              : `<p><strong>IGST Total:</strong> ${order.igstTotal}</p>`
          }
          <p class="total"><strong>Total Amount:</strong> ${
            order.totalAmount
          }</p>

          <h3>Payment</h3>
          <p><strong>Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Status:</strong> ${order.paymentStatus}</p>
          <p><strong>Transaction ID:</strong> ${order.transactionId || "—"}</p>

          <h3>Next Steps</h3>
          <p>Ship the order by <strong>${order.expectedShipment}</strong>.</p>
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} Sri Dhanvantari Exports. All rights reserved.
        </div>
      </div>
    </body>
  </html>
`,

  orderConfirmationTemplate: (customerName, order) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Your Order – Sri Dhanvantari Exports</title>
      <style>
        body  { font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; background:#fdf5e1; line-height:1.6; color:#4e474a; }
        .container { max-width:600px; margin:0 auto; background:#fdf5e1; border-radius:8px; overflow:hidden; box-shadow:0 0 20px rgba(0,0,0,0.1); }
        .header    { background:#4e474a; color:#fdf5e1; padding:30px 20px; text-align:center; }
        .content   { padding:30px; }
        table      { width:100%; border-collapse:collapse; margin:20px 0; }
        th,td      { padding:12px; text-align:left; border-bottom:1px solid #4e474a; }
        th         { background:#fff; }
        .discount  { color:#28a745; }
        .total     { font-weight:700; }
        .footer    { text-align:center; padding:20px; font-size:12px; color:#777; background:#f5f5f5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation #${order.orderNumber}</h1>
          <p>Thank you, ${customerName}!</p>
        </div>

        <div class="content">
          <h3>Order Summary</h3>
          <p><strong>Order Date:</strong> ${order.orderDate}</p>
          <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>
          ${
            order.withinTN
              ? "<p><em>This order is within Tamil Nadu (SGST/CGST applied)</em></p>"
              : "<p><em>This order is outside Tamil Nadu (IGST applied)</em></p>"
          }

          <table>
            <thead>
              <tr><th>Product</th><th>Qty</th><th>Price</th><th>Discount</th></tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (i) => `
                <tr>
                  <td>${i.name}</td>
                  <td>${i.quantity} ${i.unit}</td>
                  <td>${i.price}</td>
                  <td class="discount">${i.discount || "-"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <p><strong>Subtotal:</strong> ${order.subtotal}</p>
          <p><strong>Tax (${
            order.withinTN ? "SGST + CGST" : "IGST"
          }):</strong> ${order.tax}</p>
          <p class="total"><strong>Total Amount:</strong> ${
            order.totalAmount
          }</p>

          <h3>Shipping</h3>
          <p><strong>Method:</strong> ${order.shippingMethod}</p>
          <p><strong>Address:</strong> ${order.shippingAddress}</p>

          <p>We'll notify you once your order ships. For assistance, reply to this email.</p>

          <p>Best regards,<br/>Sri Dhanvantari Exports Team</p>
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} Sri Dhanvantari Exports. All rights reserved.
        </div>
      </div>
    </body>
  </html>`,

  contactUsTemplate: {
    owner: (contact) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>New Enquiry – Sri Dhanvantari Exports</title>
        <style>
          body  { line-height:1.6; font-family:Arial,Helvetica,sans-serif; }
          .container {
            max-width:600px; margin:0 auto; background:#fdf5e1; border-radius:8px;
            overflow:hidden; box-shadow:0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            background:#4e474a; color:#fdf5e1; padding:30px 20px; text-align:center;
          }
          .content { padding:30px; }
          .section  { margin-bottom:20px; }
          table      { width:100%; border-collapse:collapse; }
          th, td     { padding:12px; text-align:left; border-bottom:1px solid #4e474a; }
          th         { background:#fdf5e1; }
          blockquote { margin:0; padding:15px 20px; background:#fff; border-left:4px solid #4e474a; }
          .footer    {
            text-align:center; padding:20px; font-size:12px; color:#777; background:#f5f5f5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Website Enquiry</h1>
          </div>

          <div class="content">
            <p>Dear Sri Dhanvantari Exports Team,</p>
            <p>
              A visitor has submitted the contact form. The details are below:
            </p>

            <div class="section">
              <h3>Contact Information</h3>
              <table>
                <tbody>
                  <tr>
                    <th style="width:40%">Name</th>
                    <td>${contact.name}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>${contact.email}</td>
                  </tr>
                  ${
                    contact.phone
                      ? `<tr><th>Phone</th><td>${contact.phone}</td></tr>`
                      : ""
                  }
                  <tr>
                    <th>Submitted At</th>
                    <td>${new Date().toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="section">
              <h3>Message</h3>
              <blockquote>${contact.message.replace(
                /\n/g,
                "<br/>"
              )}</blockquote>
            </div>

            <p>Kindly respond to the visitor at your earliest convenience.</p>

            <p>Best regards,<br />Sri Dhanvantari Exports Website</p>
          </div>

          <div class="footer">
            © ${new Date().getFullYear()} Sri Dhanvantari Exports. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `,
    user: (contact) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Thank You – Sri Dhanvantari Exports</title>
      <style>
        body  { line-height:1.6; font-family:Arial,Helvetica,sans-serif; background:#f9f9f9; }
        .container {
          max-width:600px; margin:0 auto; background:#fdf5e1; border-radius:8px;
          overflow:hidden; box-shadow:0 0 20px rgba(0,0,0,0.1);
        }
        .header {
          background:#4e474a; color:#fdf5e1; padding:30px 20px; text-align:center;
        }
        .content { padding:30px; }
        .section  { margin-bottom:20px; }
        .footer   {
          text-align:center; padding:20px; font-size:12px; color:#777; background:#f5f5f5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Contacting Us</h1>
        </div>

        <div class="content">
          <p>Dear ${contact.name},</p>

          <p>
            We have received your message and appreciate you reaching out to us.
            A member of the Sri Dhanvantari Exports team will review your enquiry and get back to you shortly.
          </p>

          <div class="section">
            <h3>Your Submitted Details</h3>
            <p><strong>Email:</strong> ${contact.email}</p>
            ${
              contact.phone
                ? `<p><strong>Phone:</strong> ${contact.phone}</p>`
                : ""
            }
            <p><strong>Message:</strong></p>
            <p style="background:#fff;padding:12px;border-left:4px solid #4e474a;">
              ${contact.message.replace(/\n/g, "<br/>")}
            </p>
          </div>

          <p>Thank you once again. We look forward to assisting you.</p>

          <p>Warm regards,<br/>Team Sri Dhanvantari Exports</p>
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} Sri Dhanvantari Exports. All rights reserved.
        </div>
      </div>
    </body>
  </html>
`,
  },
};

module.exports = EmailTemplates;
