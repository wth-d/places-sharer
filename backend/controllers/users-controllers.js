const uuid = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Mark Zuckerburg",
    email: "abc@test.com",
    password: "testers"
  }
];

const getAllUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signupUser = (req, res, next) => {
  const errors = validationResult(req); // get validation errors
  if (!errors.isEmpty()) {
    // console.log(errors);
    next(new HttpError("Invalid inputs passed. Please check your JSON data.", 422));
    return;
  }

  const { name, email, password } = req.body;

  const duplicateUser = DUMMY_USERS.find((u) => u.email === email);
  if (duplicateUser) {
    next(new HttpError("A user with the provided email already exists.", 422));
    return;
  }

  const createdUser = {
    id: uuid.v4(),
    name,
    email,
    password
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ "user created": createdUser });
};

const loginUser = (req, res, next) => {
  const errors = validationResult(req); // get validation errors
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs passed. Please check your JSON data.", 422));
    return;
  }

  const { email, password } = req.body;

  const user = DUMMY_USERS.find((u) => u.email === email);
  if (!user) {
    next(new HttpError("User with provided email is not found.", 401));
    return;
  }

  if (user.password !== password) {
    next(new HttpError("Wrong password.", 401));
  } else {
    res.status(200).json({ message: "Logged in." });
  }
};

// export into users-routes.js
exports.getAllUsers = getAllUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
