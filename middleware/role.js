const jwt = require("jsonwebtoken");
const config = require("config");

// Middleware function to check the role of the user
function role(req, res, next) {
  // Get the role from the user object in the request
  const role = req.user.role;

  // Check if the role is not "Admin"
  if (role !== "Admin") {
    // Return a 403 Forbidden response if the role is not "Admin"
    return res.status(403).send("Access Denied");
  }

  // If the role is "Admin", proceed to the next middleware or route handler
  next();
}

module.exports = role;

