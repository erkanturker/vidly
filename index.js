const logging = require("./startup/logging");
const express = require("express");
const app = express();
const portfinder = require('portfinder');

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);


// Invoke the logging module function to configure the logger
const logger = logging();

// This function starts the server by finding an available port and setting up the server to listen on that port.
async function startServer() {
	try {
	  // Get the port from the environment variable, or use 3000 as the default port.
	  const port = process.env.PORT || 3000;

	  // Find an available port using the portfinder library, starting from the specified port.
	  const availablePort = await portfinder.getPortPromise({ port: port });

	  // Set the "port" property of the app to the available port.
	  app.set("port", availablePort);

	  // Start the server to listen on the available port.
	  const server = app.listen(availablePort, () => {
		// When the server starts listening, log a message indicating the port it's listening on.
		logger.info(`Listening on port ${availablePort}...`);
	  });

	  // Return the server instance, which can be used for closing the server later if needed.
	  return server;
	} catch (error) {
	  // If an error occurs while starting the server, log an error message and rethrow the error.
	  logger.error("Failed to start the server:", error);
	  throw error;
	}
  }

  startServer();

  // Export the startServer function so it can be used in other modules.
  module.exports = startServer;

