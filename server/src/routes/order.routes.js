const express = require("express");
const router = express.Router();

const {
  getKey,
  createRazorPayOrder,
  updatePaymentStatus,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  createOrder,
  deleteOrderWithItems,
  orderConfirmationViaEmails,
  invoiceUpload,
} = require("../controllers/order.controller.js");
const { uploadPDF } = require("./upload.routes.js");

router.get("/getKey", getKey);

router.get("/getAllOrders", getAllOrders);
router.post("/orderConfirmationViaEmails", orderConfirmationViaEmails);

router.post("/createRazorPayOrder", createRazorPayOrder);
router.post("/updatePayment", updatePaymentStatus);

router.get("/mine", getUserOrders);
router.get("/total-orders", countTotalOrders);
router.get("/total-sales", calculateTotalSales);
router.get("/total-sales-by-date", calcualteTotalSalesByDate);
router.get("/:id", findOrderById);
router.put("/:id/pay", markOrderAsPaid);
router.put("/:id/deliver", markOrderAsDelivered);

router.route("/:order_id").delete(deleteOrderWithItems);

router.post("/create-order", createOrder);
router.post("/upload-invoice", uploadPDF, invoiceUpload);

module.exports = router;
