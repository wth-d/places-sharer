const mongoose = require('mongoose');

const Schema = mongoose.Schema; // a class or constructor

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // a URL, not a file
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  creator: { type: String, required: true }
});

module.exports = mongoose.model('Place', placeSchema);
