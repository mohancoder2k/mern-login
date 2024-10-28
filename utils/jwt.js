// Importing json web token to create a token function to be used during login attempt
const jwt = require("jsonwebtoken");

// Main token function that will be sending the token with some information in it
const token = (foundUser, response) => {
  // Creating a JWT with the user's id, username, email, and environmental variables
  const jwtToken = jwt.sign(
    {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1m" // Set expiration to 1 minute
    }
  );

  // Set the token as a cookie in the response headers
  response.cookie("token", jwtToken, {
    httpOnly: true, // This prevents client-side JavaScript from accessing the cookie
    maxAge: 1 * 60 * 1000, // Ensures the cookie expires in 1 minute
  });

  // Sending the generated cookie back to the client
  return response.status(200).json({ msg: "token received" });
};

// Exporting the created token
module.exports = token;
