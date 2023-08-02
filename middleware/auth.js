const jwt = require("jsonwebtoken");
const config = require("config");

// Middleware function for user authentication
function auth(req, res, next) {
  const token = req.header("x-auth-token");

  // Check if the token exists
  if (!token) {
    return res.status(401).send("Access denied. No token provided");
  }

  try {
    // Verify and decode the token using the secret key
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

    // Store the decoded user information in req.user
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
}

module.exports = auth;
