const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/configuration");

const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id ?? user.id,
      email: user.email,
      phone: user.phone,
      username: user.username,
    },
    SECRET
  );
};

const authentication = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ error: "Authorization header is missing or invalid." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(403).json({ error: "Unauthorized access." });
  }
};

module.exports = { generateToken, authentication };
