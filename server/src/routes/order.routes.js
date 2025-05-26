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
} = require("../controllers/order.controller.js");

router.get("/getKey", getKey);

/* router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders); */

router.post("/createOrder", createOrder);
router.post('/updatePayment',updatePaymentStatus)


router.route("/mine").get(getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.get("/:id", findOrderById);
router.put("/:id/pay", markOrderAsPaid); 
/* router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, markOrderAsDelivered);*/

module.exports = router;
