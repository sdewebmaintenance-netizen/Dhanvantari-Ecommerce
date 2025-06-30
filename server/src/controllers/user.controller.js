const bcrypt = require("bcryptjs");
const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");

const GetUser = asyncHandler(async (req, res) => {
  console.log("abgiuolrfwsa", req.user);

  let existingUser;

  if (req.user.email) {
    existingUser = await prisma.user.findUnique({
      where: { email: req.user.email },
    });
  } else {
    existingUser = await prisma.user.findUnique({
      where: { phone: req.user.phone },
    });
  }

  console.log("ssa", existingUser);

  if (!existingUser) {
    return res.status(401).json({ error: "Invalid email" });
  }

  res.status(200).json({
    id: existingUser.id,
    username: existingUser.username,
    email: existingUser.email,
    phone: existingUser.phone,
    isAdmin: existingUser.isAdmin,
    GSTIN: existingUser.GSTIN,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();
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

  console.log("asdjka", req.user)
  const userId = Number(req.user.user_id);         

  try {
    const updatedUser = await prisma.User.update({
      where: { id: userId },
      data: {
        username: req.body.username,
        email:    req.body.email,
        phone:    req.body.phone,
        GSTIN:    req.body.GSTIN,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (err) {
    if (err) {                  
      return res.status(404).json({ error: 'User not found' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
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

module.exports = {
  GetUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
