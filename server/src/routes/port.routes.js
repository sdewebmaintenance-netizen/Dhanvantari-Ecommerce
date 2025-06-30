const express = require("express");
const router = express.Router();

const {
   createPort,
  updatePort,
  removePort,
  listPort,
} = require("../controllers/port.controller.js");


router.post("/", createPort);
router.put("/:portId", updatePort);
router
  .delete("/:portId", removePort);


  
module.exports = router;
