const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());
// automatically calls next() to go to next middleware;

app.use('/api/places', placesRoutes); // register the middlewares
app.use('/api/users', usersRoutes);

// handles unsupported routes;
// this middleware is reached only if a request wasn't handled by 
// a middleware in the front (which don't call next()); this means that 
// this request is one that we don't want to handle;
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  console.log("error-handling middleware in app.js");
  if (res.headerSent) {
    // a response has somehow already been sent
    next(error);
    return;
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || "An unknown error occured in the server.",
  });
});


app.listen(5000);
