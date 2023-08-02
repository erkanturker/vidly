const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");

const moment = require("moment");

router.post("/", auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const rental = await Rental.findOne({
		"customer._id": req.body.customerId,
		"movie._id": req.body.movieId,
	});

	if (!rental) res.status(404).send("No rental found");

	if (rental.dateReturned) res.status(400).send("return is already process");

	rental.dateReturned = new Date();
	const rentalDays = moment().diff(rental.dateOut, "days");
	rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
	await rental.save();

	// Using the update method to increment the numberInStock field by 1
	await Movie.updateOne(
		{ _id: req.body.movieId },
		{ $inc: { numberInStock: 1 } }
	);

	return res.status(200).send(rental);
});

module.exports = router;
