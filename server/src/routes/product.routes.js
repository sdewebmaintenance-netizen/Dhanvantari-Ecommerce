const express = require("express");
const router = express.Router();

const uploadMultipleImages = require("./upload.routes"); 

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
  requestInvoiceForPlacedOrder
} = require("../controllers/product.controller.js");

const checkId =require("../middlewares/checkId.js");


router
  .route("/")
  .get(fetchProducts)
  .post(uploadMultipleImages, addProduct);


router.route("/:id/reviews").post(checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(uploadMultipleImages, updateProductDetails)
  .delete(removeProduct);

router.route("/filtered-products").post(filterProducts);

router.post("/request-invoice",requestInvoiceForPlacedOrder);

  
module.exports = router;
