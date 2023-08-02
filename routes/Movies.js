const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");

//create movies
router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findById(req.body.genreId);
	if (!genre) return res.status(400).send("invalid Genre");

	let movie = await new Movie({
		title: req.body.title,
		genre: {
			_id: genre._id,
			name: genre.name,
		},
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate,
	});

	movie = await movie.save();
	res.send(movie);
});

//get all movies
router.get("/", async (req, res) => {
	const movies = await Movie.find();
	res.send(movies);
});

//get movies by Id
router.get("/:id", async (req, res) => {
	const movie = await Movie.findById(req.params.id);
	if (!movie) return res.status(404).send("invalid movie id");
	res.send(movie);
});

//update
router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findById(req.body.genreId);
	if (!genre) return res.status(404).send("invalid genre Id");

	const movie = await Movie.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				title: req.body.title,
				genre: {
					_id: genre._id,
					name: genre.name,
				},
				numberInStock: req.body.numberInStock,
				dailyRentalRate: req.body.dailyRentalRate,
			},
		},
		{ new: true }
	);

	if (!movie)
		return res.status(404).send("The movie with the given ID was not found.");

	res.send(movie);
});

//delete movies by id
router.delete("/:id", async (req, res) => {
	const movie = await Movie.findByIdAndRemove(req.params.id);

	if (!customer)
		return res.status(404).send("The movie with the given ID was not found.");

	res.send(movie);
});

module.exports = router;
