const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
	// Middleware function `auth` is applied before this route handler
	// It verifies the token and sets the decoded user information in `req.user`

	try {
		// Find the user by their ID and exclude the 'password' field from the query result
		const user = await User.findById(req.user._id).select("-password");

		// Send the user information as the response
		res.send(user);
	} catch (error) {
		// Handle any errors that occur during the database query
		res.status(500).send("Internal Server Error");
	}
});

router.post("/", async (req, res) => {
	// Validate the request body
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Check if the user is already registered
	let user = await User.findOne({ email: req.body.email });
	if (user) return res.status(400).send("User is already registered");

	// Create a new user object and hash the password
	user = new User(_.pick(req.body, ["name", "email", "password"]));
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	// Save the user to the database
	await user.save();

	// Generate an authentication token for the user
	const token = user.generateAuthToken();

	// Set the authentication token in the response header
	res.header("x-auth-token", token);

	// Send the user's ID, name, and email in the response body
	res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
