const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");

const createDiscount = asyncHandler(async (req, res) => {
  const { qty, price } = req.body;

  try {
    if (!qty) {
      return res.status(400).json({ error: "Quantity is required" });
    }

    const discount = await prisma.Discount.create({
      data: { qty: qty, pricetobereduced: price },
    });

    res.status(201).json(discount);
  } catch (error) {
    console.log(error);
  }
});

const updateDiscount = asyncHandler(async (req, res) => {
  const { qty, price } = req.body;
  const { discountId } = req.params;

  try {
    const discount = await prisma.Discount.findUnique({
      where: { id: parseInt(discountId) },
    });

    if (!discount) {
      return res.status(404).json({ error: "Discount not found" });
    }

    const updatedDiscount = await prisma.Discount.update({
      where: { id: parseInt(discountId) },
      data: { qty: qty, pricetobereduced: price },
    });

    res.json(updatedDiscount);
  } catch (error) {
    console.log(error);
  }
});

const removeDiscount = asyncHandler(async (req, res) => {
  const { discountId } = req.params;

  const discount = await prisma.Discount.findUnique({
    where: { id: parseInt(discountId) },
  });

  if (!discount) {
    return res.status(404).json({ error: "Discount  not found" });
  }

  await prisma.Discount.delete({
    where: { id: parseInt(discountId) },
  });

  res.json({ message: "Discount removed successfully" });
});

const listDiscount = asyncHandler(async (req, res) => {
  const discount = await prisma.Discount.findMany();
  res.json(discount);
});

module.exports = {
  createDiscount,
  updateDiscount,
  removeDiscount,
  listDiscount,
};
