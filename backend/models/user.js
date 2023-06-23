const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema; // a class or constructor

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // add "email" as index
  password: { type: String, required: true, minlength: 5 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

// "places" of a user will be dynamic, and will contain the ids of the places;

module.exports = mongoose.model('User', userSchema);
