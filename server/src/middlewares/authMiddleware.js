const jwt = require("jsonwebtoken");
const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("./asyncHandler.js");
const { JWT_SECRET } = require("../config/configuration.js");


const authenticate = asyncHandler(async (req, res, next) => {
  
  console.log("Authenticate",req.cookies)
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          email: true,
          isAdmin: true,
          createdAt: true,
          updatedAt: true
        }
      });
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
};

module.exports =  { authenticate, authorizeAdmin };
