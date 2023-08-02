const mongoose = require("mongoose");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");

const startServer = require("../../index.js");
const request = require("supertest");
const moment = require("moment");

describe("/POST returns ", () => {
	let server;
	let customerId;
	let movieId;
	let rental;
	let token;
	let movie;
	let exec = () => {
		return request(server)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send({ customerId, movieId });
	};
	beforeEach(async () => {
		server = await startServer();
		token = new User().generateAuthToken();

		customerId = new mongoose.Types.ObjectId();
		movieId = new mongoose.Types.ObjectId();

		movie = new Movie({
			_id: movieId,
			title: "genre1",
			genre: { name: "12345" },
			numberInStock: 4,
			dailyRentalRate: 2,
		});

		await movie.save();

		rental = new Rental({
			customer: {
				_id: customerId,
				name: "12345",
				phone: "123455",
			},
			movie: {
				_id: movieId,
				title: "12323",
				dailyRentalRate: 2,
			},
		});

		await rental.save();
	});

	afterEach(async () => {
		await Rental.deleteMany({});
		await Movie.deleteMany({});
		await server.close();
	});

	it("should return 401 if client not loggin", async () => {
		token = "";
		const res = await exec();
		expect(res.status).toBe(401);
	});

	it("should return 400 if consumerId was not passed", async () => {
		customerId = "";
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it("should return 400 if movieId was not passed", async () => {
		movieId = "";
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it("should return 404 if no rental is already found", async () => {
		await Rental.deleteMany({});
		const res = await exec();
		expect(res.status).toBe(404);
	});

	it("should return 400 if return is already process", async () => {
		rental.dateReturned = new Date();
		await rental.save();

		const res = await exec();
		expect(res.status).toBe(400);
	});

	it("should return 200 if valid date is passed", async () => {
		const res = await exec();
		expect(res.status).toBe(200);
	});

	it("should set set the return date if input is valid", async () => {
		const res = await exec();

		const rentalInDb = await Rental.findById(rental._id);

		expect(res.status).toBe(200);
		expect(rentalInDb.dateReturned).toBeDefined();
	});

	it("calculate the rental fee", async () => {
		rental.dateOut = moment().add(-7, "days").toDate();
		await rental.save();
		const res = await exec();

		const rentalInDb = await Rental.findById(rental._id);
		expect(rentalInDb.rentalFee).toBe(14);
	});

	it("should increae the stock if valid input ", async () => {
		const res = await exec();

		const movieInDb = await Movie.findById(movieId);

		expect(res.status).toBe(200);

		expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
	});

	it("should return rental if valid input ", async () => {
		const res = await exec();

		const rentalInDb = await Rental.findById(rental._id);

		expect(res.body).toHaveProperty("dateOut");
		expect(res.body).toHaveProperty("dateReturned");
		expect(res.body).toHaveProperty("rentalFee");
		expect(res.body).toHaveProperty("customer");
		expect(res.body).toHaveProperty("movie");
	});
});
