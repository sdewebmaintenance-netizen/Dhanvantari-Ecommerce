const express = require("express");
const router = express.Router();

const {
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
  getOrderDetailsAndSendEmails,
  deleteOrderWithItems
} = require("../controllers/order.controller.js");

router.get("/getKey", getKey);

router.get("/getAllOrders", getAllOrders);

router.post("/createOrder", createOrder);
router.post("/updatePayment", updatePaymentStatus);

router.get("/mine", getUserOrders);
router.get("/total-orders", countTotalOrders);
router.get("/total-sales", calculateTotalSales);
router.get("/total-sales-by-date", calcualteTotalSalesByDate);
router.get("/:id", findOrderById);
router.put("/:id/pay", markOrderAsPaid);
router.put("/:id/deliver", markOrderAsDelivered);

router
  .route("/:order_id")
  .delete(deleteOrderWithItems);

  router.post("/orderConfirmation", getOrderDetailsAndSendEmails);

module.exports = router;
