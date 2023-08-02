const winston = require("winston");

// Create a new Winston logger instance
const logger = winston.createLogger({
  level: 'error', // Set the log level to 'error' to capture only errors
  transports: [
    // Add the Console transport to log to the console
    new winston.transports.Console()
    // Add other transports as per your requirements (e.g., File transport)
  ]
});

// Custom error handling middleware
module.exports = function (err, req, res, next) {
  // Log the error message using Winston logger
  logger.error(err.message);

  // Optionally, log the stack trace for better debugging
  logger.error(err.stack);

  // Send a more detailed error response to the client
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Something went wrong on the server.",
      code: err.code || "UNKNOWN_ERROR",
    },
  });
};
