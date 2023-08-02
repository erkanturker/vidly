const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const JoiObjectId = require("joi-objectid")(Joi);

const movieSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 250,
	},
	genre: {
		type: genreSchema,
		required: true,
	},
	numberInStock: {
		type: Number,
		required: true,
		min: 0,
		max: 255,
	},
	dailyRentalRate: {
		type: Number,
		required: true,
		min: 0,
		max: 255,
	},
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
	const schema = Joi.object({
		title: Joi.string().min(3).max(50).required(),
		genreId: JoiObjectId().required(),
		numberInStock: Joi.number().required(),
		dailyRentalRate: Joi.number().required(),
	});

	return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
