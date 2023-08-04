const express = require('express');
const { check } = require("express-validator");

const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();


router.get('/:pId', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.post(
  "/",
  fileUpload.single("image"), // "image" here is the same as the formData's field-name in frontend
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
    check("creator").not().isEmpty(),
    check("isprivate").not().isEmpty()
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pId",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("isprivate").not().isEmpty()
  ],
  placesControllers.updatePlace
);

router.delete('/:pId', placesControllers.deletePlace);

module.exports = router; // export the router object (into app.js)
