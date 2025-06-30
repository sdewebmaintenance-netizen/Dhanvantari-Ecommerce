const express = require("express");
const router = express.Router();

const {
  createCart,
  updateCart,
  removeCart,
  listCart,
  clearCart
} = require("../controllers/cart.controller.js");

router.post("/", createCart);
router.put("/:cartId", updateCart);
router.delete("/clear", clearCart);
router.delete("/:cartId", removeCart);
router.get("/cart", listCart);


module.exports = router;
