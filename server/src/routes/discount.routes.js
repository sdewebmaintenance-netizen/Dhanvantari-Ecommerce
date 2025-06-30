const express = require("express");
const router = express.Router();

const {
  createDiscount,
  updateDiscount,
  removeDiscount,
  listDiscount,
} = require("../controllers/discount.controller.js");

router.post("/", createDiscount);
router.put("/:discountId", updateDiscount);
router.delete("/:discountId", removeDiscount);
router.get("/discounts", listDiscount);

module.exports = router;
