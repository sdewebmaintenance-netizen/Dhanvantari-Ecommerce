

const EmailTemplates = {
  requestQuoteTemplate:  {
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
                      <p><strong>Phone:</strong> ${requesterDetails.phone || 'Not provided'}</p>
                      <p><strong>Company:</strong> ${requesterDetails.company || 'Not provided'}</p>
                      <p><strong>Country:</strong> ${requesterDetails.country || 'Not provided'}</p>
                  </div>
                  
                  <div class="details-box">
                      <h3>Requested Products</h3>
                      ${productDetails.map(product => `
                          <div class="product-item">
                              <p><strong>Product:</strong> ${product.name}</p>
                              <p><strong>Quantity:</strong> ${product.quantity}</p>
                              ${product.specifications ? `<p><strong>Specifications:</strong> ${product.specifications}</p>` : ''}
                          </div>
                      `).join('')}
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
                          ${productNames.map(product => `<li>${product}</li>`).join('')}
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
    `
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
                    ${orderDetails.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} (${item.quantity} ${item.unit})</span>
                            <span>${item.price}</span>
                        </div>
                    `).join('')}
                    
                    <div class="order-item">
                        <span>Shipping</span>
                        <span>${orderDetails.shippingCost}</span>
                    </div>
                    
                    <div class="order-item total">
                        <span>Total Amount</span>
                        <span>${orderDetails.totalAmount}</span>
                    </div>
                </div>
                
                <p>Payment Status: <strong>${orderDetails.paymentStatus}</strong></p>
                <p>Expected Shipment Date: <strong>${orderDetails.expectedShipment}</strong></p>
                
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

  // 3. Order Placed - Sent to owner
  orderPlacedTemplate: (orderDetails) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>New Order Received - Sridhanvantari Exports</title>
        <style>
            body {
                line-height: 1.6;
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
                background-color: #4e474a;
                color: #fdf5e1;
                padding: 30px 20px;
                text-align: center;
            }
            .content {
                padding: 30px;
            }
            .order-details {
                margin: 20px 0;
            }
            .section {
                margin-bottom: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
            }
            th, td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #4e474a;
            }
            th {
                background-color: #fdf5e1;
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
                <h1>New Order Received</h1>
                <p>Order #${orderDetails.orderNumber}</p>
            </div>
            <div class="content">
                <p>Dear Sridhanvantari Exports Team,</p>
                <p>A new order has been placed on the website. Please find the details below:</p>
                
                <div class="order-details">
                    <div class="section">
                        <h3>Customer Information</h3>
                        <p><strong>Name:</strong> ${orderDetails.customer.name}</p>
                        <p><strong>Email:</strong> ${orderDetails.customer.email}</p>
                        <p><strong>Phone:</strong> ${orderDetails.customer.phone}</p>
                        <p><strong>Shipping Address:</strong> ${orderDetails.shippingAddress}</p>
                    </div>
                    
                    <div class="section">
                        <h3>Order Summary</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orderDetails.items.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.quantity} ${item.unit}</td>
                                        <td>${item.unitPrice}</td>
                                        <td>${item.totalPrice}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                                    <td>${orderDetails.subtotal}</td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="text-align: right;"><strong>Tax:</strong></td>
                                    <td>${orderDetails.taxAmount}</td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                                    <td>${orderDetails.totalAmount}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    <div class="section">
                        <h3>Payment Information</h3>
                        <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
                        <p><strong>Payment Status:</strong> ${orderDetails.paymentStatus}</p>
                        ${orderDetails.transactionId ? `<p><strong>Transaction ID:</strong> ${orderDetails.transactionId}</p>` : ''}
                    </div>
                    
                    <div class="section">
                        <h3>Next Steps</h3>
                        <p>Please process this order as soon as possible. The customer expects shipment by <strong>${orderDetails.expectedShipment}</strong>.</p>
                        <p>Order Source: Website</p>
                    </div>
                </div>
                
                <p>Best regards,<br>Sri Dhanvantari Exports System</p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Sri Dhanvantari Exports. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `,

  // 4. Order Confirmation - Sent to user
  orderConfirmationTemplate: (userName, orderDetails) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Order Confirmation - Sridhanvantari Exports</title>
        <style>
            body {
                line-height: 1.6;
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
                background-color: #4e474a;
                color: #fdf5e1;
                padding: 30px 20px;
                text-align: center;
            }
            .content {
                padding: 30px;
            }
            .order-summary {
                border: 1px solid #4e474a;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
            }
            .order-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
            }
            .total {
                font-weight: bold;
                margin-top: 10px;
                border-top: 2px solid #4e474a;
                padding-top: 10px;
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
                <h1>Order Confirmation</h1>
                <p>Thank you for your order with Sridhanvantari Exports</p>
            </div>
            <div class="content">
                <p>Dear ${userName},</p>
                <p>Thank you for your order! We've received it and are preparing it for shipment. Below are the details of your purchase:</p>
                
                <div class="order-summary">
                    <h3>Order #${orderDetails.orderNumber}</h3>
                    <p><strong>Order Date:</strong> ${orderDetails.orderDate}</p>
                    <p><strong>Estimated Delivery:</strong> ${orderDetails.estimatedDelivery}</p>
                    
                    <h4>Items Ordered</h4>
                    ${orderDetails.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} (${item.quantity} ${item.unit})</span>
                            <span> ${item.price}</span>
                        </div>
                    `).join('')}
                    
                    
                    <div class="order-item total">
                        <span>Total Amount </span>
                        <span>${orderDetails.totalAmount}</span>
                    </div>
                </div>
                
                <div class="tracking">
                    <h3>Shipping Information</h3>
                    <p><strong>Shipping Method:</strong> ${orderDetails.shippingMethod}</p>
                    <p><strong>Shipping Address:</strong> ${orderDetails.shippingAddress}</p>
                </div>
                
                <p>If you have any questions about your order, please reply to this email or contact our customer service team at <a href="mailto:sales@sridhanvantariexports.com">sales@sridhanvantariexports.com</a>.</p>
                
                <p>Thank you for choosing Sri Dhanvantari Exports!</p>
                
                <p>Best regards,<br>Sri Dhanvantari Exports Team</p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Sri Dhanvantari Exports. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `
};

module.exports = EmailTemplates;