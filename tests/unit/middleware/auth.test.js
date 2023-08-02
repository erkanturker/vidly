const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should populate req.user with the payload of a valid JWT", () => {
    // Create a sample user object with an _id and role property
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      role: "Admin",
    };

    // Generate a JWT token using the User model's generateAuthToken method,
    // passing the sample user object as the payload
    const token = new User(user).generateAuthToken();

    // Create a mock request object with a header function that returns the JWT token
    const req = {
      header: jest.fn().mockReturnValue(token),
    };

    // Create an empty response object
    const res = {};

    // Create a mock function for the 'next' middleware function
    const next = jest.fn();

    // Call the auth middleware with the mock request, response, and next functions
    auth(req, res, next);

    // Add an assertion to verify that req.user is defined and contains the same properties and values as the sample user object
    expect(req.user).toMatchObject(user);
  });
});
