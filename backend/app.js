const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());
// automatically calls next() to go to next middleware;

app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/uploads/places-images", express.static(path.join("uploads", "places-images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Origin, X-Requested-With, Accept"
  ); // allow the frontend to add these headers to a request sent to backend
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use('/api/places', placesRoutes); // register the middlewares
app.use('/api/users', usersRoutes);

// handles unsupported routes;
// this middleware is reached only if a request wasn't handled by a middleware
// in the front (which don't call next() with no argument); this
// means that this request is one that we don't want to handle;
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  console.log("error-handling middleware in app.js");
  if (req.file) { // if a file was sent
    fs.unlink(req.file.path, (err) => {
      if (err) console.log(err);
    });
  }
  if (res.headerSent) {
    // a response has somehow already been sent
    next(error);
    return;
    // Note: it might end up here if an image url cannot be found & served statically.
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || "An unknown error occured in the server.",
  });
});


const dbUrl = "mongodb+srv://wth:iyftPQx7QCJdehCr@cluster0.vhz6pgo.mongodb.net/places-db?retryWrites=true&w=majority";

mongoose.connect(dbUrl)
  .then(() => {
    app.listen(5000);
    console.log("Connected to the database!");
  })
  .catch((rejectReason) => {
    console.log("Connection failed!");
    console.log(rejectReason);
  });

