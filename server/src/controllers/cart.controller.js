const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");

const createCart = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const { product_id, quantity } = req.body;

  try {
    if (!product_id || !quantity || !user_id) {
      return res
        .status(400)
        .json({ error: "Product ID, Quantity, and User ID are required" });
    }

    const existingCartItem = await prisma.Cart.findFirst({
      where: {
        product_id: parseInt(product_id),
        user_id: parseInt(user_id),
      },
    });

    let cart;

    if (existingCartItem) {
      cart = await prisma.Cart.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + parseInt(quantity),
        },
      });
    } else {
      cart = await prisma.Cart.create({
        data: {
          product_id: parseInt(product_id),
          quantity: parseInt(quantity),
          user_id: parseInt(user_id),
        },
      });
    }

    res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const updateCart = asyncHandler(async (req, res) => {
  console.log("Ssss", req.body);
  const { quantity } = req.body;
  const { cartId } = req.params;

  try {
    const cart = await prisma.Cart.findUnique({
      where: { id: parseInt(cartId) },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    const updatedCart = await prisma.Cart.update({
      where: { id: parseInt(cartId) },
      data: { quantity: parseInt(quantity) },
      include: {
        Products: true,
      },
    });

    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const removeCart = asyncHandler(async (req, res) => {
  const { cartId } = req.params;

  try {
    const cart = await prisma.Cart.findUnique({
      where: { id: parseInt(cartId) },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await prisma.Cart.delete({
      where: { id: parseInt(cartId) },
    });

    res.json({ message: "Cart item removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const clearCart = asyncHandler(async (req, res) => {
  const { user_id } = req.user;

  try {
    await prisma.Cart.deleteMany({
      where: { user_id: parseInt(user_id) },
    });

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const listCart = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const cart = await prisma.Cart.findMany({
    where: { user_id: parseInt(user_id) },
    include: {
      Products:{
        include:{
          ProductImages:true
        }
      },
      CartShippingAddress: true,
    },
  });

  console.log("ss", cart)

  res.json(cart);
});

module.exports = {
  createCart,
  updateCart,
  removeCart,
  listCart,
  clearCart,
};
