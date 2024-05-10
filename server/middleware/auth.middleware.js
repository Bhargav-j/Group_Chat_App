const jwt = require("jsonwebtoken");
// const config = require('../config/environment');
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from 'Bearer token' token format
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  // console.log(token)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyToken;
