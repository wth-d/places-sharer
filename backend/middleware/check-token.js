const jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");

// logic of a middleware function for validating the token in a request

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") { // handle OPTIONS requests
    next();
    return;
  }

  try {
    // req.headers.authorization could be undefined if the authorization header isn't added
    const token = req.headers.authorization.split(" ")[1]; // the header will look like - (Authorization: 'Bearer TOKEN')
    if (!token) {
      // token isn't included in the request
      throw new Error("Authentication failed!");
    }

    const decodedPayload = jwt.verify(token, process.env.JWT_key); // returns the decoded payload of the token
    req.userData = { userId: decodedPayload.userId };
    next(); // if no error above, then the token is successfully verified;
  } catch (error) {
    console.log("Possible errors: Token not attached to request OR attached token is invalid.");
    const err = new HttpError("Authentication failed (in check-token.js)!", 401);
    next(err);
    return;
  }

};
