const express = require("express");
const router = express.Router();

const {
  createIncoTerm,
  updateIncoTerm,
  removeIncoTerm,
} = require("../controllers/incoterm.controller.js");


router.post("/", createIncoTerm);
router.put("/:incotermId", updateIncoTerm);
router
  .delete("/:incotermId", removeIncoTerm);

  
module.exports = router;
