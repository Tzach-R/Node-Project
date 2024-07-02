const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  state: {
    type: String,
    maxlength: 256,
    trim: true,
    lowercase: true,
    default: ""
  },
  country: {
    type: String,
    minlength: 2,
    maxlength: 256,
    trim: true,
    lowercase: true,
    default: "",
    required: true
  },
  city: {
    type: String,
    minlength: 2,
    maxlength: 256,
    trim: true,
    lowercase: true,
    default: "",
    required: true
  },
  street: {
    type: String,
    minlength: 2,
    maxlength: 256,
    trim: true,
    lowercase: true,
    default: "",
    required: true
  },
  houseNumber: {
    type: Number,
    required: true,
    min: 1
  },
  zip: {
    type: Number,
    min: 1000,
    default: 0
  }
});

module.exports = addressSchema;
