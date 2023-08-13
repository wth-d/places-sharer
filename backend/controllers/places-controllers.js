const fs = require('fs');

const uuid = require('uuid');
// const uuidv4 = uuid.v4; // then to use: uuidv4()
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordinatesForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

// let DUMMY_PLACES = [
//   {
//     id: "p2",
//     title: "Robarts Library #2",
//     description: "The largest library in Canada - for p2.",
//     imageUrl:
//       "https://lh3.googleusercontent.com/p/AF1QipPogTV20XRMlrjVPtlyOG5p9oeYcziXBYo_WEBf=s1360-w1360-h1020",
//     address: "130 St George St, Toronto, ON, M5S 1A5",
//     location: {
//       lat: 43.6645012,
//       lng: -79.4084233,
//     },
//     creator: "u2",
//   },
//   {
//     id: "p1",
//     title: "Robarts Library",
//     description: "The largest library in Canada.",
//     imageUrl:
//       "https://onesearch.library.utoronto.ca/sites/default/public/styles/max_650x650/public/libraryphotos/robarts-library_0.jpg?itok=Ud4zhDLg",
//     address: "130 St George St, Toronto, ON, M5S 1A5",
//     location: {
//       lat: 43.6645012,
//       lng: -79.4084233,
//     },
//     creator: "u1",
//   },
// ];


const getPlaceById = async (req, res, next) => {
  // console.log("GET /:pId request in Places");
  const placeId = req.params.pId; // req.params gives: { pId: 'p1' }

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    console.log(error);
    next(new HttpError("Something went wrong, could not find a place.", 500));
    return;
  }
  
  // const place = DUMMY_PLACES.find((p) => {
  //   return p.id === placeId;
  // });

  if (!place) { // place === undefined
    // res.status(404);
    // res.json({ message: "Could not find a place for the provided pId." });

    const error = new HttpError(
      "Could not find a place for the provided pId.",
      404
    );
    next(error);
    return;
    // throw error;
  } else {
    res.json({ place: place.toObject({ getters: true }) });
  }
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId }); // find all places that match userId
    // or use .populate(): userWithPlaces = await User.findById(userId).populate('places');
    // old: places = DUMMY_PLACES.filter((p) => p.creator === userId); // or for...of loop
  } catch (error) {
    console.log(error);
    next(
      new HttpError(
        "Something went wrong, could not find places for the userId.",
        500
      )
    );
    return;
  }
  
  // if (!userWithPlaces || userWithPlaces.places.length === 0)
  if (!places || places.length === 0) {
    // res
    //   .status(404)
    //   .json({ message: "Could not find a place for the provided user id." });

    const error = new HttpError(
      "Could not find any place for the provided user id.",
      404
    ); // has a message prop
    next(error);
    return;
  } else {
    res.json({
      places: places.map((place) => place.toObject({ getters: true })),
    });
  }
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req); // get validation errors
  if (!errors.isEmpty() || !req.file) {
    console.log(errors);
    if (!req.file) console.log(`error: req.file is ${req.file}`);
    next(new HttpError("Invalid inputs passed. Please check your JSON data.", 422));
    return;
  }

  const { title, description, address, creator, isprivate } = req.body;
  // same as: const title = req.body.title;

  // validate "isprivate"; (when received, isprivate will be a string;)
  if (isprivate !== "true" && isprivate !== "false") {
    next(new HttpError("Wrong value for input isprivate.", 422));
    return;
  }

  if (creator !== req.userData.userId) {
    next(new HttpError("You cannot create a place for a different user.", 403));
    return;
  }

  let coordinates;
  try {
    coordinates = await getCoordinatesForAddress(address);
  } catch (error) {
    console.log("getCoordinatesForAddress (API) error");
    console.log("original error code:", error.code);
    error.code = 500;
    next(error); // forward the error
    return; // and exit this function
  }

  const createdPlace = new Place({
    title,
    description,
    image: req.file.path, // a relative path
    location: coordinates,
    address,
    isprivate,
    creator,
  });

  // check whether the userid provided in creator exists;
  let existingUser;
  try {
    existingUser = await User.findById(creator);
    // existingUser = await User.findOne({ "_id": creator });
  } catch (error) {
    const err = new HttpError(
      "Search for user failed.",
      500
    );
    next(err);
    return;
  }

  if (!existingUser) {
    next(
      new HttpError(
        "The provided creator does not exist.",
        422 // or 404
      )
    );
    return;
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session });
    existingUser.places.push(createdPlace); // Mongoose .push() - only pushes the id
    await existingUser.save({ session });
    await session.commitTransaction(); // commit all changes

    // DUMMY_PLACES.push(createdPlace); // or: .unshift(createdPlace)
  } catch (error) {
    console.log("Creating place failed. Please try again.");
    next(new HttpError("Creating place failed. Please try again.", 500));
    return;
  }
  
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req); // get validation errors
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs passed. Please check your JSON data.", 422));
    return;
  }

  const placeId = req.params.pId;
  const { title, description, isprivate } = req.body;

  // validate "isprivate"
  if (isprivate !== true && isprivate !== false) {
    // console.log(`isprivate is '${isprivate}'`);
    // console.log("isprivate!=='true':", isprivate !== "true");
    // console.log("isprivate!==true:", isprivate !== true);
    next(new HttpError("Wrong value for input isprivate.", 422));
    return;
  }

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError(
      "Something went wrong. Could not find the to-be-updated place.",
      500
    );
    next(err);
    return;
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided pId.",
      404
    );
    next(error);
    return;
  }

  // note: "place.creator" is a Mongoose object ID type
  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this place.", 403);
    next(error);
    return;
  }

  place.title = title;
  place.description = description;
  place.isprivate = isprivate;

  try {
    await place.save(); // save the updated place
  } catch (error) {
    const err = new HttpError(
      "Something went wrong. Could not save the updated place.",
      500
    );
    next(err);
    return;
  }

  // updating a new copy instead of directly modifying the original object
  // const updatedPlaceCopy = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  // updatedPlaceCopy.title = title;
  // updatedPlaceCopy.description = description;

  // DUMMY_PLACES[placeIndex] = updatedPlaceCopy;

  // convert Mongoose object into a JS object before sending back in response
  res.status(200).json({ "updated-place": place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pId;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
    // console.log(place);
  } catch (error) {
    const err = new HttpError(
      "Something went wrong. Could not find the to-be-deleted place.",
      500
    );
    next(err);
    return;
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided pId.",
      404
    );
    next(error);
    return;
  }

  if (place.creator["_id"].toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to delete this place.", 403);
    next(error);
    return;
  }

  const imagePath = place.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.deleteOne({ session });
    place.creator.places.pull(place); // pulls/removes the id only
    await place.creator.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    const err = new HttpError(
      "Something went wrong. Could not delete the place.",
      500
    );
    next(err);
    return;
  }

  fs.unlink(imagePath, (err) => {
    if (err) console.log(err);
  });

  console.log(`place deleted:\n${place}`);
  res.status(200).json({ message: "Deleted place." });
};

// export into places-routes.js
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
