const config = require("config");

module.exports = function () {
	/*
This code is typically added to the index.js (or the entry point of your application)
to ensure that the necessary configuration values are properly defined before starting the application.
It helps catch critical errors at the start-up phase and prevents the application from running with missing or incorrect configuration.
*/
	// Check if the JWT private key is defined in the configuration
	if (!config.get("jwtPrivateKey")) {
		throw new Error("jwt private key is not defined");
	}
};
