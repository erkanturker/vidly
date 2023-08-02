const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
const request = require("supertest");
const startServer = require("../../index.js");
let server;

describe("auth Middleware", () => {


	beforeEach(async () => {
		server = await startServer();
	  });

	  afterEach(async () => {
		await Genre.deleteMany({});
		await server.close();
	  });

	let token;
	const exec = () => {
		return request(server)
			.post("/api/genres")
			.set("x-auth-token", token)
			.send({ name: "genre1" });
	};
	beforeEach(() => {
		token = new User().generateAuthToken();
	});

	it("should return 401 if no token is provied", async () => {
		token = "";
		const res = await exec();
		expect(res.status).toBe(401);
	});

	it("should return 400 if invalid is provied", async () => {
		token = "a";
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it("should return 200 valid test token is provied", async () => {
		const res = await exec();
		expect(res.status).toBe(200);
	});
});
