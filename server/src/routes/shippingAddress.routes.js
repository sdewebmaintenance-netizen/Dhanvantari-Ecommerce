const express = require("express");
const router = express.Router();

const {
  createShippingAddress,
  updateShippingAddress,
  removeShippingAddress,
  listShippingAddress,
  listAllShippingAddress
} = require("../controllers/shippingAddress.controller.js");

router.post("/", createShippingAddress);
router.put("/:shippingAddressId", updateShippingAddress);
router.delete("/:shippingAddressId", removeShippingAddress);
router.get("/shippingAddress", listShippingAddress);
router.get("/listAllShippingAddress", listAllShippingAddress);

module.exports = router;
