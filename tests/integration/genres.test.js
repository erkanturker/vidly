const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const startServer = require("../../index.js");
let server;

describe("api/genres", () => {

	beforeEach(async () => {
		server = await startServer();
	  });

	  afterEach(async () => {
		await Genre.deleteMany({});
		await server.close();
	  });

	describe("GET/ ", () => {
		it("should return all the genres", async () => {
			await Genre.collection.insertMany([
				{ name: "genre1" },
				{ name: "genre2" },
			]);

			let res = await request(server).get("/api/genres");
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
			expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
		});
	});

	describe("GET /:id", () => {
		it("should return a genre if valid id is passed", async () => {
			const genre = new Genre({ name: "genre123" });
			await genre.save();

			const res = await request(server).get("/api/genres/" + genre._id);
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("name", genre.name);
		});

		it("should return 404 if genre was not found", async () => {
			const res = await request(server).get(
				"/api/genres/615ed9d6ac9b393c45a8d93f"
			);
			expect(res.status).toBe(404);
		});

		it("should return 400 if invalid genre passed", async () => {
			const res = await request(server).get("/api/genres/123");
			expect(res.status).toBe(400);
		});
	});

	describe("POST/", () => {
		let token;
		let name;

		const exec = async () => {
			return await request(server)
				.post("/api/genres")
				.set("x-auth-token", token)
				.send({ name: name });
		};

		beforeEach(() => {
			token = new User().generateAuthToken();
			name = "genre1";
		});

		it("should return 401 if client not loggin", async () => {
			token = "";

			const res = await exec();

			expect(res.status).toBe(401);
		});

		it("should return 400 if genre is less than 5 chars", async () => {
			name = "love";

			const res = await exec();

			expect(res.status).toBe(400);
		});

		it("should save the genre if it is valid", async () => {
			const res = await exec();

			const genre = await Genre.find({ name: "genre1" });

			expect(genre).not.toBeNull();
			expect(res.status).toBe(200);
		});

		it("should save the genre if it is valid", async () => {
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("_id");
			expect(res.body).toHaveProperty("name", "genre1");
		});
	});
});
