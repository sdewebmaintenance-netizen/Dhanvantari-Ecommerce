const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");

const GetUser = asyncHandler(async (req, res) => {
  console.log("abgiuolrfwsa", req.user);

  const existingUser = await prisma.user.findUnique({
    where: { email: req.user.email },
  });

  if (!existingUser) {
    return res.status(401).json({ error: "Invalid email" });
  }
  
  res.status(200).json({
    id: existingUser.id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
  });
});



const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      isAdmin: true,
      createdAt: true,
    },
  });
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.user_id },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  res.json(user);
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.user_id },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  let hashedPassword;
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.user_id },
    data: {
      username: req.body.username || user.username,
      email: req.body.email || user.email,
      password: hashedPassword || user.password,
    },
    select: {
      id: true,
      username: true,
      email: true,
      isAdmin: true,
    },
  });

  res.json(updatedUser);
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  if (user.isAdmin) {
    return res.status(400).json({ error: "Cannot delete admin user" });
  }

  await prisma.user.delete({
    where: { id: parseInt(req.params.id) },
  });

  res.json({ message: "User removed" });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
    select: {
      id: true,
      username: true,
      email: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(req.params.id) },
    data: {
      isAdmin: Boolean(req.body.userRole),
    },
    select: {
      id: true,
      username: true,
      email: true,
      isAdmin: true,
    },
  });

  res.json(updatedUser);
});

module.exports ={
  GetUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
