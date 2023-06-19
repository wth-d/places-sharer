const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = express();

app.use('/api/places', placesRoutes); // register the middlewares

app.use((error, req, res, next) => {
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
