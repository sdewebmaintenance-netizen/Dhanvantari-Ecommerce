const { CLIENT_URL } = require("../config/configuration");
const { generateToken } = require("../utils/jwt");
const { prisma } = require("../config/prismaClient.config.js");
const { hashPassword, comparePassword } = require("../utils/password.js");

const googleCallback = (req, res) => {
  const user = req.user;

  console.log("req.use", req.user);

  const token = generateToken(user);

  const isAdmin = req.user.isAdmin;

  console.log(user);

  console.log(token);

  res.redirect(`${CLIENT_URL}/callback?token=${token}&isAdmin=${isAdmin}`);
};

const failure = (req, res) => {
  res.send("Failed...!");
};

const loginWithPhone = async (req, res) => {
  try {
    const { phone, password } = req.body;

    console.log("sajkl", req.body);
    const user = await prisma.User.findUnique({
      where: { phone },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("sajkl", user);

    const token = generateToken(user);
    console.log("sajkl", token);

    const isAdmin = user.isAdmin;

    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        loginMethod: "PHONE",
      },
    });
    res.status(200).json({ token, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

const signupWithPhone = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const existingUser = await prisma.User.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return res
        .status(404)
        .json({ error: "Phone Number is Linked with Another Account" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.User.create({
      data: {
        phone: phone,
        password: hashedPassword,
      },
    });

    const token = generateToken(user);

    const isAdmin = user.isAdmin;

    res.status(200).json({ token, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sign-Up failed" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { phone },
    });
    if (!user) {
      return res.status(404).json({ error: "Phone number not found" });
    }
    const hashedPassword = await hashPassword(password);
    await prisma.User.update({
      where: { phone },
      data: { password: hashedPassword },
    });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process request" });
  }
};

module.exports = {
  googleCallback,
  failure,
  loginWithPhone,
  signupWithPhone,
  forgotPassword,
};
