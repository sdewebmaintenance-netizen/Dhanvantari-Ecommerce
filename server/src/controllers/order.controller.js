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

const createRazorPayOrder = asyncHandler(async (req, res) => {
  console.log("Request body:", req.body);
  const { totalPrice } = req.body;

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

  res.status(201).json({ payment, RazorPay_Order });
});

const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    SGST,
    CGST,
    IGST,
    totalPrice,
    appliedDiscounts,
    paymentId,
  } = req.body;

  const { user_id } = req.user;

  try {
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items" });
    }

    const order = await prisma.Order.create({
      data: {
        user_id: req.user.user_id,
        shippingAddress_id: shippingAddress.id,
        paymentMethod,
        paymentResult_id: paymentId,
        itemsUnitPrice: parseFloat(itemsPrice),
        SGST: parseFloat(SGST),
        CGST: parseFloat(CGST),
        IGST: parseFloat(IGST),
        totalPrice: parseFloat(totalPrice),
        isPaid: true,
        paidAt: new Date(),
        orderItems: {
          create: orderItems.map((item) => {
            const itemDiscount = appliedDiscounts.find(
              (discount) => discount.product_id === item.product_id
            );

            return {
              name: item.name,
              qty: item.quantity,
              product_id: item.product_id,
              discount_id: itemDiscount?.discount_id || null,
            };
          }),
        },
      },
      include: {
        orderItems: {
          include: {
            OrderItemProduct: true,
            OrderDiscount: true,
          },
        },
        OrderUser: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
        OrderShippingAddress: true,
        OrderPaymentResult: true,
      },
    });

     const outOfStockItems = [];

    await Promise.all(
      orderItems.map(async (item) => {
        const updatedProduct = await prisma.Product.update({
          where: { id: item.product_id },
          data: {
            countInStock: {
              decrement: item.quantity,
            },
          },
        });

        if (updatedProduct.countInStock < updatedProduct.moq) {
          outOfStockItems.push(updatedProduct);
        }
      })
    );

    await prisma.cart.deleteMany({
      where: { user_id: parseInt(user_id) },
    });

     if (outOfStockItems.length > 0) {
      const outOfStockData = {
        orderNumber: order.id,
        customer: {
          name: order.OrderUser.username,
          email: order.OrderUser.email,
          phone: order.OrderUser.phone,
        },
        items: outOfStockItems.map((p) => ({
          name: p.name,
          quantity: orderItems.find((oi) => oi.product_id === p.id)?.quantity,
          weight: p.weight,
          unit: "kg",
          isOutOfStock: true,
        })),
      };

      const outOfStockHtml = EmailTemplates.outOfStockTemplate(outOfStockData);

      await EmailTransmitter(
        NODEMAILER_USERNAME, 
        `Out of Stock Alert`,
        outOfStockHtml,
        []
      );
    }


    res.status(200).json({
      message: "Order Created successfully",
      order,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

const orderConfirmationViaEmails = asyncHandler(async (req, res) => {
  try {
    const { order } = req.body;

    const Order = await prisma.order.findUnique({
      where: { id: parseInt(order.id) },
      include: {
        OrderUser: true,
        orderItems: {
          include: {
            OrderItemProduct: true,
            OrderDiscount: true,
          },
        },
        OrderShippingAddress: true,
        OrderPaymentResult: true,
      },
    });

    if (!Order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const isWithinTamilNadu = () => {
      const shippingAddress = order.OrderShippingAddress;
      const stateToCheck = shippingAddress.deliveryState
        ? shippingAddress.deliveryState
        : shippingAddress.state;

      return stateToCheck === "TN";
    };

    const withinTN = isWithinTamilNadu();

    const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const expectedShipment = new Date(
      new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const orderPlacedData = {
      orderNumber: order.id.toString(),
      customer: {
        name: order.OrderUser.username,
        email: order.OrderUser.email,
        phone: order.OrderUser.phone || "N/A",
      },
      shippingAddress: `${order.OrderShippingAddress.addressLine1}, ${order.OrderShippingAddress.district}, ${order.OrderShippingAddress.state} - ${order.OrderShippingAddress.pincode}, ${order.OrderShippingAddress.country}`,
      items: order.orderItems.map((item) => {
        const originalPrice = item.OrderItemProduct.price * item.qty;
        const discountedPrice = item.OrderDiscount
          ? (item.OrderItemProduct.price -
              item.OrderDiscount.pricetobereduced) *
            item.qty
          : originalPrice;

        const itemSGST = withinTN
          ? (discountedPrice * item.OrderItemProduct.SGST) / 100
          : 0;
        const itemCGST = withinTN
          ? (discountedPrice * item.OrderItemProduct.CGST) / 100
          : 0;
        const itemIGST = !withinTN
          ? (discountedPrice * item.OrderItemProduct.IGST) / 100
          : 0;
        const itemTotal = discountedPrice + itemSGST + itemCGST + itemIGST;

        return {
          name: item.name,
          quantity: item.qty.toString(),
          weight: item.OrderItemProduct.weight.toString(),
          unit: "kg",
          originalPrice: `₹${originalPrice.toFixed(2)}`,
          discountedPrice: item.OrderDiscount
            ? `₹${discountedPrice.toFixed(2)}`
            : null,
          discountAmount: item.OrderDiscount
            ? `₹${(item.OrderDiscount.pricetobereduced * item.qty).toFixed(2)}`
            : null,
          sgst: withinTN
            ? `₹${itemSGST.toFixed(2)} (${item.OrderItemProduct.SGST}%)`
            : null,
          cgst: withinTN
            ? `₹${itemCGST.toFixed(2)} (${item.OrderItemProduct.CGST}%)`
            : null,
          igst: !withinTN
            ? `₹${itemIGST.toFixed(2)} (${item.OrderItemProduct.IGST}%)`
            : null,
          totalPrice: `₹${itemTotal.toFixed(2)}`,
        };
      }),
      subtotal: `₹${order.itemsUnitPrice.toFixed(2)}`,
      totalDiscount: `₹${order.orderItems
        .reduce((total, item) => {
          return (
            total +
            (item.OrderDiscount
              ? item.OrderDiscount.pricetobereduced * item.qty
              : 0)
          );
        }, 0)
        .toFixed(2)}`,
      sgstTotal: withinTN ? `₹${order.SGST.toFixed(2)}` : null,
      cgstTotal: withinTN ? `₹${order.CGST.toFixed(2)}` : null,
      igstTotal: !withinTN ? `₹${order.IGST.toFixed(2)}` : null,
      totalAmount: `₹${order.totalPrice.toFixed(2)}`,
      paymentMethod: order.paymentMethod,
      paymentStatus: "Paid",
      transactionId: order.OrderPaymentResult?.transactionId
        ? order.OrderPaymentResult?.transactionId
        : "N/A – Direct payment method selected.",
      expectedShipment: expectedShipment,
      withinTN: withinTN,
    };

    const orderConfirmationData = {
      orderNumber: order.id.toString(),
      orderDate: orderDate,
      estimatedDelivery: expectedShipment,
      items: order.orderItems.map((item) => {
        const originalPrice = item.OrderItemProduct.price * item.qty;

        const discountedPrice = item.OrderDiscount
          ? (item.OrderItemProduct.price -
              item.OrderDiscount.pricetobereduced) *
            item.qty
          : item.OrderItemProduct.price * item.qty;

        const itemSGST = withinTN
          ? (discountedPrice * item.OrderItemProduct.SGST) / 100
          : 0;
        const itemCGST = withinTN
          ? (discountedPrice * item.OrderItemProduct.CGST) / 100
          : 0;
        const itemIGST = !withinTN
          ? (discountedPrice * item.OrderItemProduct.IGST) / 100
          : 0;
        const itemTotal = discountedPrice + itemSGST + itemCGST + itemIGST;

        return {
          name: item.name,
          quantity: item.qty.toString(),
          weight: item.OrderItemProduct.weight.toString(),
          unit: "kg",
          originalPrice: `₹${originalPrice.toFixed(2)}`,
          price: `₹${itemTotal.toFixed(2)}`,
          discount: item.OrderDiscount
            ? `₹${(item.OrderDiscount.pricetobereduced * item.qty).toFixed(2)}`
            : null,
        };
      }),
      subtotal: `₹${order.itemsUnitPrice.toFixed(2)}`,
      tax: withinTN
        ? `₹${(order.SGST + order.CGST).toFixed(2)}`
        : `₹${order.IGST.toFixed(2)}`,
      totalAmount: `₹${order.totalPrice.toFixed(2)}`,
      shippingMethod: "Standard Shipping",
      shippingAddress: `${order.OrderShippingAddress.addressLine1}, ${order.OrderShippingAddress.district}, ${order.OrderShippingAddress.state} - ${order.OrderShippingAddress.pincode}, ${order.OrderShippingAddress.country}`,
      withinTN: withinTN,
    };

    const adminHtml = EmailTemplates.orderPlacedTemplate(orderPlacedData);
    const customerHtml = EmailTemplates.orderConfirmationTemplate(
      order.OrderUser.username,
      orderConfirmationData
    );

    const attachments = [];

    await EmailTransmitter(
      Order.OrderUser.email,
      `Your Order #${Order.id} Confirmation`,
      customerHtml,
      attachments
    );

    await EmailTransmitter(
      NODEMAILER_USERNAME,
      `New Order #${Order.id}`,
      adminHtml,
      attachments
    );

    res.json({ success: true, message: "Emails sent successfully" });
  } catch (error) {
    console.error("Email confirmation error:", error);
    res.status(500).json({ error: "Failed to send confirmation emails" });
  }
});

const deleteOrderWithItems = asyncHandler(async (req, res) => {
  const { order_id } = req.params;

  try {
    const order = await prisma.Order.findUnique({
      where: { id: parseInt(order_id) },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    await Promise.all(
      order.orderItems.map(async (item) => {
        await prisma.Product.update({
          where: { id: item.product_id },
          data: {
            countInStock: {
              increment: item.qty,
            },
          },
        });
      })
    );

    await prisma.OrderItem.deleteMany({
      where: { order_id: parseInt(order_id) },
    });

    if (order.paymentResult_id) {
      await prisma.PaymentResult.delete({
        where: { id: order.paymentResult_id },
      });
    }
    await prisma.Order.delete({
      where: { id: parseInt(order_id) },
    });

    res.status(200).json({
      message: "Order and all associated items deleted successfully",
      restoredItems: order.orderItems.length,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
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
          OrderDiscount: true,
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

const invoiceUpload = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No invoice file uploaded" });
    }

    const filePath = `/invoices/${req.file.filename}`;

    if (req.body.orderId) {
      await prisma.order.update({
        where: { id: parseInt(req.body.orderId) },
        data: { invoicePath: filePath },
      });
    }

    res.json({
      success: true,
      filePath: filePath,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Invoice upload error:", error);
    res.status(500).json({ error: "Failed to process invoice upload" });
  }
});

module.exports = {
  getKey,
  createRazorPayOrder,
  updatePaymentStatus,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  createOrder,
  deleteOrderWithItems,
  orderConfirmationViaEmails,
  invoiceUpload,
};
