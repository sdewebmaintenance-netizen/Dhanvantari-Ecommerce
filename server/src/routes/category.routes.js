const express = require("express");
const router = express.Router();

const {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} = require("../controllers/category.controller.js");


router.post("/", createCategory);
router.put("/:categoryId", updateCategory);
router
  .delete("/:categoryId", removeCategory);
router.get("/categories", listCategory);
router.get("/:id", readCategory);

  
module.exports = router;
