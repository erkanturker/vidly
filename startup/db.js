const mongoose = require("mongoose");
const logging = require("./logging");
const config = require('config');

module.exports = function () {
	// Create the logger instance
	const logger = logging();
	const db = config.get('db');

	mongoose
		.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			logger.info(`Connected to ${db}`);
		})
		.catch((err) => {
			logger.error("Error connecting to MongoDB:", err);
			process.exit(1); // Terminate the process if the connection fails
		});
};
