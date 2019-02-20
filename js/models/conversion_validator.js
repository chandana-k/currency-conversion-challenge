// Required variables and dependencies
const mongoose = require('mongoose');
const validate = require('mongoose-validator');

// ISO currency codes are three-letter alphabetic codes that represent the various currencies used throughout the world.
// Mongoose Validator simply returns Mongoose style validation objects that utilises validator.js for the data validation.
var isoValidator = [
  validate({
    validator: "isLength",
    arguments: [3],
    message: "The ISO currency code should comprise of 3 letters."
  }),
  validate({
    validator: "isAlpha",
    passIfEmpty: true,
    message: "The ISO currency code should contain only alphabet characters."
  })
];

// Using the Schema constructor, create a new currency conversion Schema object.
const convertToSchema = mongoose.Schema({
  iso: {
    type: String,
    required: true,
    validate: isoValidator
  },
  name: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const conversionSchema = mongoose.Schema({
  iso: {
    type: String,
    required: true,
    validate: isoValidator
  },
  name: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  ratePublicationTime: {
    type: Date,
    required: true
  },
  conversionTime: {
    type: Date,
    default: Date.now(),
    required: true
  },
  convertTo: [convertToSchema]
});
// This creates our model from the above schema, using mongoose's model method.
const Conversion = mongoose.model("Conversion", conversionSchema);
// Export the currency conversion validator schema model.
module.exports = { Conversion: Conversion };