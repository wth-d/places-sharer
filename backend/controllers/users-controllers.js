const uuid = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

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

const signupUser = async (req, res, next) => {
  const errors = validationResult(req); // get validation errors
  if (!errors.isEmpty()) {
    // console.log(errors);
    next(new HttpError("Invalid inputs passed. Please check your JSON data.", 422));
    return;
  }

  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError(
      "Search for duplicated user failed. Please try again later.",
      500
    );
    next(err);
    return;
  }

  if (existingUser) {
    next(
      new HttpError(
        "A user with the provided email already exists. Please login instead.",
        422
      )
    );
    return;
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://bkimg.cdn.bcebos.com/pic/8644ebf81a4c510f7c7e489a6959252dd52aa5fc?x-bce-process=image/resize,m_lfit,w_536,limit_1/format,f_auto",
    places
  });

  try {
    await createdUser.save();
  } catch (error) {
    console.log("Creating user failed. Please try again.");
    next(new HttpError("Signing up failed. Please try again.", 500));
    return;
  }

  // adding "toObject" here to add "id" is optional?
  res.status(201).json({ "user created": createdUser.toObject({ getters: true }) });
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
