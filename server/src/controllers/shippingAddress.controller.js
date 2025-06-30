const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");

const createShippingAddress = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const {
    addressLine1,
    addressLine2,
    country,
    state,
    district,
    pincode,
    gstin,
    transportation,
    vehicleNumber,
    deliveryCountry,
    deliveryState,
    deliveryDistrict,
    deliveryPincode,
    contactNumber,
  } = req.body.newShippingAddress;

  try {
    if (!addressLine1 || !country || !state) {
      return res
        .status(400)
        .json({ error: "AddressLine, Country and State are required" });
    }

    const newShippingAddress = await prisma.ShippingAddress.create({
      data: {
        addressLine1,
        addressLine2,
        country,
        state,
        district,
        pincode,
        gstin,
        transportation,
        vehicleNumber,
        deliveryCountry,
        deliveryState,
        deliveryDistrict,
        deliveryPincode,
        contactNumber,
      },
    });

    const updatedCarts = await prisma.cart.updateMany({
      where: {
        user_id: user_id,
      },
      data: {
        shipping_address_id: newShippingAddress.id,
      },
    });

    res.status(201).json(newShippingAddress);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateShippingAddress = asyncHandler(async (req, res) => {
  const {
    addressLine1,
    addressLine2,
    country,
    state,
    district,
    pincode,
    gstin,
    transportation,
    vehicleNumber,
    deliveryCountry,
    deliveryState,
    deliveryDistrict,
    deliveryPincode,
    contactNumber,
  } = req.body;
  const { shippingAddressId } = req.params;

  try {
    const shippingAddress = await prisma.ShippingAddress.findUnique({
      where: { id: parseInt(shippingAddressId) },
    });

    if (!shippingAddress) {
      return res.status(404).json({ error: "Shipping Address not found" });
    }

    const updatedShippingAddress = await prisma.ShippingAddress.update({
      where: { id: parseInt(shippingAddressId) },
      data: {
        addressLine1,
        addressLine2,
        country,
        state,
        district,
        pincode,
        gstin,
        transportation,
        vehicleNumber,
        deliveryCountry,
        deliveryState,
        deliveryDistrict,
        deliveryPincode,
        contactNumber,
      },
    });

    res.json(updatedShippingAddress);
  } catch (error) {
    console.log(error);
  }
});

const removeShippingAddress = asyncHandler(async (req, res) => {
  const { shippingAddressId } = req.params;

  const {user_id}= req.user;

  const shippingAddress = await prisma.ShippingAddress.findUnique({
    where: { id: parseInt(shippingAddressId) },
  });

  if (!shippingAddress) {
    return res.status(404).json({ error: "Shipping Address  not found" });
  }

  await prisma.ShippingAddress.delete({
    where: { id: parseInt(shippingAddressId) },
  });

  const updatedCarts = await prisma.cart.updateMany({
      where: {
        user_id: user_id,
      },
      data: {
        shipping_address_id: null,
      },
    });

  res.json({ message: "Shipping Address removed successfully" });
});

const listShippingAddress = asyncHandler(async (req, res) => {
  const { user_id } = req.user;

  const cart = await prisma.cart.findFirst({
    where: { user_id },
    select: { shipping_address_id: true },
  });

  if (!cart || !cart.shipping_address_id) {
    return res
      .status(404)
      .json({ message: "No shipping address linked to cart" });
  }

  const shippingAddress = await prisma.shippingAddress.findUnique({
    where: { id: cart.shipping_address_id },
  });

  if (!shippingAddress) {
    return res.status(404).json({ message: "Shipping address not found" });
  }

  res.json(shippingAddress);
});

module.exports = {
  createShippingAddress,
  updateShippingAddress,
  removeShippingAddress,
  listShippingAddress,
};
