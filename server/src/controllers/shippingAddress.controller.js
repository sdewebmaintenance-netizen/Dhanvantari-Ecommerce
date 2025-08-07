const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");

const createShippingAddress = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const {
    addressLine1,
    addressLine2,
    customerName,
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
        customerName,
        user_id
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
    customerName
  } = req.body;
  const { shippingAddressId } = req.params;

  const {user_id} = req.user;

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
        customerName,
        user_id
      },
    });

    res.json(updatedShippingAddress);
  } catch (error) {
    console.log(error);
  }
});

const removeShippingAddress = asyncHandler(async (req, res) => {
  const { shippingAddressId } = req.params;

  const { user_id } = req.user;

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
  });

  if (!cart) {
    return res.status(404).json({ message: "No cart found for this user" });
  }

  let shippingAddress;

  if (cart.shipping_address_id != null) {
    shippingAddress = await prisma.shippingAddress.findUnique({
      where: { id: cart.shipping_address_id },
    });
  }

  res.json({ shippingAddress, cart });
});

const listAllShippingAddress = asyncHandler(async (req, res) => {
  const { user_id } = req.user;

  const shippingAddress = await prisma.ShippingAddress.findMany({
    where: { user_id },
  });

  if (!shippingAddress) {
    return res
      .status(404)
      .json({ message: "No shipping address found for this user" });
  }

  res.json(shippingAddress);
});

module.exports = {
  createShippingAddress,
  updateShippingAddress,
  removeShippingAddress,
  listShippingAddress,
  listAllShippingAddress,
};
