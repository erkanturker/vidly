const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 255,
	},
	password: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 1024,
	},
    role:{
        type:String,
        enum:['Office','Admin'],
        default:'Admin',
    },
});

userSchema.methods.generateAuthToken = function () {
	//The generateAuthToken function is defined as a method on the userSchema. This means that it can be called on an instance of the User model.
	// Generate an authentication token using the user's ID, and user role and the JWT private key
	const token = jwt.sign({ _id: this._id,role:this.role }, config.get("jwtPrivateKey"));

	// Return the generated token
	return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(50).required(),
		email: Joi.string().min(3).max(255).required().email(),
		password: Joi.string().min(3).max(1024).required(),
	});

	return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
