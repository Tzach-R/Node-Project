const jwt = require("jsonwebtoken");
const chalk = require("chalk");

function authorize(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    console.error(chalk.red("Access denied. No token provided."));
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(chalk.blue("JWT payload:", JSON.stringify(payload, null, 2)));

    req.user = payload;
    req.isAdmin = payload.role === "admin";
    req.isBusiness = payload.role === "business";

    next();
  } catch (err) {
    console.error(chalk.red("Token verification error:", err));
    res.status(400).send("Invalid token.");
  }
}

module.exports = authorize;
