const {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
} = require("../config/configuration.js");
const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");
const Razorpay = require("razorpay");
const razorpay = require("../config/razorPayInstance.js");

function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const getKey = async (req, res) => {
  res.status(200).json(RAZORPAY_KEY_ID);
};

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ error: "No order items" });
  }

  const productIds = orderItems.map((item) => parseInt(item.id));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingProduct = products.find(
      (product) => product.id === parseInt(itemFromClient.id)
    );

    if (!matchingProduct) {
      throw new Error(`Product not found: ${itemFromClient.id}`);
    }

    return {
      name: matchingProduct.name,
      qty:parseInt(itemFromClient.qty),
      image: matchingProduct.image,
      price: matchingProduct.price,
      product_id: matchingProduct.id,
    };
  });

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
    calcPrices(dbOrderItems);

  const createdShippingAddress = await prisma.shippingAddress.create({
    data: {
      address: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
    },
  });

  const orderOptions = {
    amount: parseFloat(totalPrice) * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  let RazorPay_Order;
  try {
    RazorPay_Order = await razorpay.orders.create(orderOptions);
    console.log("Creating Razorpay order with:", orderOptions);
    console.log("afjcoia", RazorPay_Order);

    if (!RazorPay_Order?.id) throw new Error("Failed to create Razorpay order");
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    return res.status(500).json({ error: "Failed to create Razorpay order" });
  }
  console.log("bfcsliuqf", req.user);

  let payment;

  if (RazorPay_Order.id) {
    payment = await prisma.PaymentResult.create({
      data: {
        transactionId: RazorPay_Order.id,
        status: "Success",
        emailAddress: req.user.email,
      },
    });
  }

  console.log("dborder", dbOrderItems);

  const order = await prisma.order.create({
    data: {
      user_id: req.user.user_id,
      isPaid: true,
      paidAt: new Date(),
      shippingAddress_id: createdShippingAddress.id,
      paymentMethod,
      itemsPrice: parseFloat(itemsPrice),
      taxPrice: parseFloat(taxPrice),
      shippingPrice: parseFloat(shippingPrice),
      totalPrice: parseFloat(totalPrice),
      orderItems: {
        create: dbOrderItems,
      },
      paymentResult_id: payment.id,
    },
    include: {
      orderItems: true,
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
  const salesByDate = await prisma.$queryRaw`
    SELECT 
      DATE(paidAt) as date,
      SUM(totalPrice) as totalSales
    FROM "Order"
    WHERE isPaid = true
    GROUP BY DATE(paidAt)
  `;
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
          OrderItemProduct: true,
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
