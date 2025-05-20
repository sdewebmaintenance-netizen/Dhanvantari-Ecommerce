const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");



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

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ error: "No order items" });
  }


  const productIds = orderItems.map(item => parseInt(item.id));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });


  const dbOrderItems = orderItems.map(itemFromClient => {
    const matchingProduct = products.find(
      product => product.id === parseInt(itemFromClient.id)
    );

    if (!matchingProduct) {
      throw new Error(`Product not found: ${itemFromClient.id}`);
    }

    return {
      name: matchingProduct.name,
      qty: itemFromClient.qty,
      image: matchingProduct.image,
      price: matchingProduct.price,
      productid: matchingProduct.id,
    };
  });

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
    calcPrices(dbOrderItems);


  const createdShippingAddress = await prisma.shippingAddress.create({
    data: {
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country
    }
  });

  const order = await prisma.order.create({
    data: {
      user_id: req.user.id,
      shippingAddress_id: createdShippingAddress.id,
      paymentMethod,
      itemsPrice: parseFloat(itemsPrice),
      taxPrice: parseFloat(taxPrice),
      shippingPrice: parseFloat(shippingPrice),
      totalPrice: parseFloat(totalPrice),
      orderItems: {
        create: dbOrderItems
      }
    },
    include: {
      orderItems: true,
      OrderUser: {
        select: {
          id: true,
          username: true,
          email: true
        }
      },
      OrderShippingAddress: true
    }
  });

  res.status(201).json(order);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      OrderUser: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });
  res.json(orders);
});

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { user_id: req.user.id }
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
      totalPrice: true
    }
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
          email: true
        }
      },
      orderItems: {
        include: {
          OrderItemProduct: true
        }
      },
      OrderShippingAddress: true,
      OrderPaymentResult: true
    }
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
});

const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(req.params.id) }
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }


  const paymentResult = await prisma.paymentResult.create({
    data: {
      transactionId: req.body.id,
      status: req.body.status,
      updateTime: req.body.update_time,
      emailAddress: req.body.payer.email_address
    }
  });


  const updatedOrder = await prisma.order.update({
    where: { id: parseInt(req.params.id) },
    data: {
      isPaid: true,
      paidAt: new Date(),
      paymentResult_id: paymentResult.id
    },
    include: {
      OrderPaymentResult: true
    }
  });

  res.json(updatedOrder);
});

const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const updatedOrder = await prisma.order.update({
    where: { id: parseInt(req.params.id) },
    data: {
      isDelivered: true,
      deliveredAt: new Date()
    }
  });

  res.json(updatedOrder);
});

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};