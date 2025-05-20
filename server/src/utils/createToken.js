const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/configuration");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  console.log("aikslufg token", token);

  return token;
};
module.exports = generateToken;
