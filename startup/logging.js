const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
	// Create a Winston logger instance
	const logger = winston.createLogger({
		transports: [
			// Console transport for logging to the console with colors and pretty printing
			new winston.transports.Console({ colorize: true, prettyPrint: true }),

			// File transport for logging to a file named "logfile.log"
			new winston.transports.File({ filename: "logfile.log" }),

			// MongoDB transport for logging to a MongoDB database
			new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" }),
		],
	});

	// Handle uncaught exceptions
	process.on("uncaughtException", (ex) => {
		logger.error(ex.message, ex);
		process.exit(1);
	});

	// Handle unhandled promise rejections
	process.on("unhandledRejection", (ex) => {
		logger.error(ex.message, ex);
		process.exit(1);
	});

	// Return the logger instance
	return logger;
};
