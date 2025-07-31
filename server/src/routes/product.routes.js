const express = require("express");
const router = express.Router();

const {uploadProductImages} = require("../middlewares/multerConfiguration.js"); 

const {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  requestInvoiceForPlacedOrder,
  fetchAllProductsAdmin
} = require("../controllers/product.controller.js");

const checkId =require("../middlewares/checkId.js");
router
  .route("/")
  .get(fetchProducts)
  .post(uploadProductImages, addProduct);
router.route("/:id/reviews").post(checkId, addProductReview);
router.get("/allproductsadmin", fetchAllProductsAdmin);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);
router
  .route("/:id")
  .get(fetchProductById)
  .put(uploadProductImages, updateProductDetails)
  .delete(removeProduct);
router.route("/filtered-products").post(filterProducts);
router.post("/request-invoice",requestInvoiceForPlacedOrder);

module.exports = router;
