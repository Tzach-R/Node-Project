const mongoose = require("mongoose");

const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    default: "",
    trim: true,
    match: urlRegex,
  },
  alt: {
    type: String,
    maxlength: 255,
    trim: true,
    lowercase: true,
    default: "",
  },
});

module.exports = imageSchema;
