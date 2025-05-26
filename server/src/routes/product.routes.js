const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");

const {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} = require("../controllers/product.controller.js");

const checkId =require("../middlewares/checkId.js");

router
  .route("/")
  .get(fetchProducts)
  .post(formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(formidable(), updateProductDetails)
  .delete(removeProduct);

router.route("/filtered-products").post(filterProducts);

  
module.exports = router;
