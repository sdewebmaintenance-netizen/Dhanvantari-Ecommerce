const express = require("express");
const passport = require("passport");
const {
  googleCallback,
  failure,
  loginWithPhone,
  signupWithPhone,
  forgotPassword,
} = require("../controllers/auth.controller");

const { exportCategories } = require("../controllers/category.controller.js");

const { listIncoTerm } = require("../controllers/incoterm.controller.js");

const { listPort } = require("../controllers/port.controller.js");

const { fetchAllProducts, requestQuotaForExportProduct } = require("../controllers/product.controller.js");

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get("/google/callback", passport.authenticate("google"), googleCallback);
router.get("/failure", failure);
router.post("/login", loginWithPhone);
router.post("/signup", signupWithPhone);
router.post("/forgot-password", forgotPassword);

 

//Un-Protected-Routes
router.get("/exportCategories", exportCategories);
router.get("/incoterm", listIncoTerm);
router.get("/ports", listPort);
router.get("/allproducts", fetchAllProducts);
router.post("/request-quota", requestQuotaForExportProduct);


module.exports = router;