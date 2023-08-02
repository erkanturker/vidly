const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
	it("it should return a valid JWT", () => {
		// Create a payload object with a unique ID and role "Admin"
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(), // Generate a new ObjectID and convert it to a hexadecimal string
            role: "Admin", // Set the role to "Admin"
          };

          // Create a new User instance using the payload as data
          const user = new User(payload);

          // Generate an authentication token (JWT) using the user instance
          const token = user.generateAuthToken();

          // Decode the JWT to obtain its payload
          const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

          // Expect the decoded payload to match the original payload
          expect(decoded).toMatchObject(payload);
	});
});
