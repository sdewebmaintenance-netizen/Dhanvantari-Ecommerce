const {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  NODEMAILER_USERNAME,
} = require("../config/configuration.js");
const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");
const Razorpay = require("razorpay");
const razorpay = require("../config/razorPayInstance.js");
const { EmailTransmitter } = require("../utils/nodemailer.js");
const EmailTemplates = require("../utils/EmailTemplates.js");

const getKey = async (req, res) => {
  res.status(200).json(RAZORPAY_KEY_ID);
};

const createOrder = asyncHandler(async (req, res) => {
  console.log("Ssss", req.body);
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    SGST,
    CGST,
    totalPrice,
  } = req.body;

  const { user_id } = req.user;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ error: "No order items" });
  }

  const orderOptions = {
    amount: Math.round(totalPrice * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  let RazorPay_Order;
  try {
    RazorPay_Order = await razorpay.orders.create(orderOptions);
    if (!RazorPay_Order?.id) throw new Error("Failed to create Razorpay order");
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    return res.status(500).json({ error: "Failed to create Razorpay order" });
  }

  const payment = await prisma.PaymentResult.create({
    data: {
      transactionId: RazorPay_Order.id,
      status: "Success",
      emailAddress: req.user.email,
    },
  });

  const order = await prisma.Order.create({
    data: {
      user_id: req.user.user_id,
      shippingAddress_id: shippingAddress.id,
      paymentMethod,
      paymentResult_id: payment.id,
      itemsUnitPrice: parseFloat(itemsPrice),
      SGST: parseFloat(SGST),
      CGST: parseFloat(CGST),
      totalPrice: parseFloat(totalPrice),
      isPaid: true,
      paidAt: new Date(),
      orderItems: {
        create: orderItems.map((item) => ({
          name: item.name,
          qty: item.quantity,
          product_id: item.product_id,
        })),
      },
    },
    include: {
      orderItems: {
        include: {
          OrderItemProduct: true,
        },
      },
      OrderUser: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      OrderShippingAddress: true,
    },
  });

  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const expectedShipment = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  console.log("ss", order);
  order.orderItems.map((item) => {
    console.log("sabkj", item);
  });

  const emptyCart = await prisma.cart.deleteMany({
    where: { user_id: parseInt(user_id) },
  });

  const orderPlacedData = {
    orderNumber: order.id.toString(),
    customer: {
      name: req.user.username,
      email: req.user.email,
      phone: req.user.phone,
    },
    shippingAddress: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}, ${shippingAddress.country}`,
    items: order.orderItems.map((item) => ({
      name: item.name,
      quantity: item.qty.toString(),
      unit: "kg",
      unitPrice: `₹${item.OrderItemProduct.price.toFixed(2)}`,
      totalPrice: `₹${(item.OrderItemProduct.price * item.qty).toFixed(2)}`,
    })),
    subtotal: `₹${order.itemsUnitPrice.toFixed(2)}`,
    taxAmount: `₹${order.SGST.toFixed(2) + order.CGST.toFixed(2)}`,
    totalAmount: `₹${order.totalPrice.toFixed(2)}`,
    paymentMethod: paymentMethod,
    paymentStatus: "Paid",
    transactionId: RazorPay_Order.id,
    expectedShipment: expectedShipment,
  };

  const orderConfirmationData = {
    orderNumber: order.id.toString(),
    orderDate: orderDate,
    estimatedDelivery: expectedShipment,
    items: order.orderItems.map((item) => ({
      name: item.name,
      quantity: item.qty.toString(),
      unit: "kg",
      price: `₹${(item.OrderItemProduct.price * item.qty).toFixed(2)}`,
    })),
    totalAmount: `₹${order.totalPrice.toFixed(2)}`,
    shippingMethod: "Wholesale Shipping",
    shippingAddress: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}, ${shippingAddress.country}`,
  };

  const ownerHtml = EmailTemplates.orderPlacedTemplate(orderPlacedData);
  const customerHtml = EmailTemplates.orderConfirmationTemplate(
    req.user.username,
    orderConfirmationData
  );

  try {
    await EmailTransmitter(
      NODEMAILER_USERNAME,
      `New Order Placed - #${order.id}`,
      ownerHtml
    );

    await EmailTransmitter(
      req.user.email,
      `Your Order Confirmation - #${order.id}`,
      customerHtml
    );
  } catch (emailError) {
    console.error("Error sending emails:", emailError);
  }

  res.status(201).json({ order, RazorPay_Order });
});

const updatePaymentStatus = async (req, res) => {
  try {
    const auth = `Basic ${Buffer.from(
      `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`
    ).toString("base64")}`;

    const response = await axios.get(
      `https://api.razorpay.com/v1/payments/${payment_id}`,
      {
        headers: { Authorization: auth },
      }
    );

    const paymentDetails = response.data;
    console.log("Payment Details:", paymentDetails);

    const paymentMethod =
      paymentDetails.method === "wallet"
        ? paymentDetails.wallet
        : paymentDetails.method === "upi"
        ? paymentDetails.vpa
        : paymentDetails.method === "card"
        ? `${paymentDetails.method} - ${paymentDetails.bank}`
        : paymentDetails.method;

    console.log("Payment Method:", paymentMethod);

    res.status(200).json({
      message: "Payment details updated successfully",
      subscriptionPayment,
    });
  } catch (error) {
    console.error(
      "Error updating payment details:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      OrderUser: {
        select: {
          id: true,
          username: true,
        },
      },
      orderItems: true,
    },
  });
  res.json(orders);
});

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { user_id: req.user.user_id },
    include: {
      orderItems: true,
    },
  });

  res.json(orders);
});

const countTotalOrders = asyncHandler(async (req, res) => {
  const totalOrders = await prisma.order.count();
  res.json({ totalOrders });
});

const calculateTotalSales = asyncHandler(async (req, res) => {
  const result = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
  });
  res.json({ totalSales: result._sum.totalPrice || 0 });
});

const calcualteTotalSalesByDate = asyncHandler(async (req, res) => {
  const salesByDate = await prisma.$queryRawUnsafe(`
    SELECT 
      DATE(paidAt) as date,
      SUM(totalPrice) as totalSales
    FROM \`Order\`
    WHERE isPaid = true
    GROUP BY DATE(paidAt)
  `);

  res.json(salesByDate);
});

const findOrderById = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      OrderUser: {
        select: {
          username: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          OrderItemProduct: {
            include: {
              ProductImages: true,
            },
          },
        },
      },
      OrderShippingAddress: true,
      OrderPaymentResult: true,
    },
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
});

const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const paymentResult = await prisma.paymentResult.create({
    data: {
      transactionId: req.body.id,
      status: req.body.status,
      updateTime: req.body.update_time,
      emailAddress: req.body.payer.email_address,
    },
  });

  const updatedOrder = await prisma.order.update({
    where: { id: parseInt(req.params.id) },
    data: {
      isPaid: true,
      paidAt: new Date(),
      paymentResult_id: paymentResult.id,
    },
    include: {
      OrderPaymentResult: true,
    },
  });

  res.json(updatedOrder);
});

const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const updatedOrder = await prisma.order.update({
    where: { id: parseInt(req.params.id) },
    data: {
      isDelivered: true,
      deliveredAt: new Date(),
    },
  });

  res.json(updatedOrder);
});

module.exports = {
  getKey,
  createOrder,
  updatePaymentStatus,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};
