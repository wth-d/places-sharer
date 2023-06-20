const express = require('express');

const placesControllers = require('../controllers/places-controllers');

const router = express.Router();


router.get('/:pId', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlaceByUserId);

router.post('/', placesControllers.createPlace);

module.exports = router; // export the router object (into app.js)
