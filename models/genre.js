const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50,
	},
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
	const schema = Joi.object({
		name: Joi.string().min(5).required(),
	});

	return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;
