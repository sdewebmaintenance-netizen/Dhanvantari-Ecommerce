const express = require("express");
const router = express.Router();

const {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
} = require("../controllers/category.controller.js");


router.post("/", createCategory);
router.put("/:categoryId", updateCategory);
router
  .delete("/:categoryId", removeCategory);
router.get("/categories", listCategory);


  
module.exports = router;
