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

const router = express.Router();

router.get("/getAllUsers", getAllUsers);

router.get("/getuser", GetUser);

router
  .route("/profile")
  .get(getCurrentUserProfile)
  .put(updateCurrentUserProfile);

router
  .route("/:id")
  .delete(deleteUserById)
  .get(getUserById)
  .put(updateUserById);

module.exports = router;
