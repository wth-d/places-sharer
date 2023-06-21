const uuid = require('uuid');
// const uuidv4 = uuid.v4; // then to use: uuidv4()
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

let DUMMY_PLACES = [
  {
    id: "p2",
    title: "Robarts Library #2",
    description: "The largest library in Canada - for p2.",
    imageUrl:
      "https://lh3.googleusercontent.com/p/AF1QipPogTV20XRMlrjVPtlyOG5p9oeYcziXBYo_WEBf=s1360-w1360-h1020",
    address: "130 St George St, Toronto, ON, M5S 1A5",
    location: {
      lat: 43.6645012,
      lng: -79.4084233,
    },
    creator: "u2",
  },
  {
    id: "p1",
    title: "Robarts Library",
    description: "The largest library in Canada.",
    imageUrl:
      "https://onesearch.library.utoronto.ca/sites/default/public/styles/max_650x650/public/libraryphotos/robarts-library_0.jpg?itok=Ud4zhDLg",
    address: "130 St George St, Toronto, ON, M5S 1A5",
    location: {
      lat: 43.6645012,
      lng: -79.4084233,
    },
    creator: "u1",
  },
];


const getPlaceById = (req, res, next) => {
  // console.log("GET /:pId request in Places");
  const placeId = req.params.pId; // req.params gives: { pId: 'p1' }

  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) { // place === undefined
    // res.status(404);
    // res.json({ message: "Could not find a place for the provided pId." });

    const error = new HttpError(
      "Could not find a place for the provided pId.",
      404
    );
    throw error;
  } else {
    res.json({ place: place });
  }
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = [];
  for (let place of DUMMY_PLACES) {
    if (place.creator === userId) {
      places.push(place);
    }
  }
  // or: use places = DUMMY_PLACES.filter((p) => p.creator === userId);

  if (!places || places.length === 0) {
    // res
    //   .status(404)
    //   .json({ message: "Could not find a place for the provided user id." });

    const error = new HttpError(
      "Could not find any place for the provided user id.",
      404
    ); // has a message prop
    next(error);
  } else {
    res.json({ places: places });
  }
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req); // get validation errors
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError("Invalid inputs passed. Please check your JSON data.", 422));
    return;
  }

  const { title, description, coordinates, address, creator } = req.body;
  // same as: const title = req.body.title;
  const createdPlace = {
    id: uuid.v4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace); // or: .unshift(createdPlace)

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req); // get validation errors
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError("Invalid inputs passed. Please check your JSON data.", 422));
    return;
  }

  const placeId = req.params.pId;
  const { title, description } = req.body;

  // updating a new copy instead of directly modifying the original object
  const updatedPlaceCopy = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlaceCopy.title = title;
  updatedPlaceCopy.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlaceCopy;

  res.status(200).json({ "updated-place": updatedPlaceCopy });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pId;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => {
    p.id !== placeId;
  });

  res.status(200).json({ message: "Deleted place." });
};

// export into places-routes.js
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
