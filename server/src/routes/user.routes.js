const express = require("express");

const {
  GetUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} = require("../controllers/user.controller.js");

const { authenticate, authorizeAdmin } =require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/getuser", GetUser);


router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);


router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);

module.exports = router;
