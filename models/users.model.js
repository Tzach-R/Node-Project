const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const nameSchema = require("./nameSchema ");
const addressSchema = require("./addressSchema");
const imageSchema = require("./imageSchema");

const userSchema = new mongoose.Schema(
  {
    name: nameSchema,
    address: addressSchema,
    image: imageSchema,
    email: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
      unique: true,
      lowercase: true,
      match: RegExp(
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      ),
    },
    password: {
      type: String,
      required: true,
      minlength: 9,
      maxlength: 1024,
      trim: true,
    },

    isBusiness: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      match: RegExp(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/),
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    loginAttempts: {
      type: Number,
      required: true,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    methods: {
      generateAuthToken() {
        return jwt.sign(
          { _id: this._id, isBusiness: this.isBusiness, isAdmin: this.isAdmin },
          process.env.JWT_SECRET
        );
      },
    },
  }
);

const User = mongoose.model("User", userSchema, "users");

// Locking a user for 24 hours after entering an incorrect password 3 times in a row
userSchema.methods.incrementLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil > Date.now()) {
    return;
  }
  this.loginAttempts += 1;
  if (this.loginAttempts >= 3) {
    this.lockUntil = Date.now() + 24 * 60 * 60 * 1000;
  }
  return this.save();
};
userSchema.methods.resetLoginAttempts = function () {
  this.loginAttempts = 0;
  this.lockUntil = null;
  return this.save();
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(2).max(255).required(),
      middle: Joi.string().min(2).max(255),
      last: Joi.string().min(2).max(255).required(),
    }).required(),
    address: Joi.object({
      state: Joi.string().min(2).max(255),
      country: Joi.string().min(2).max(255),
      city: Joi.string().min(2).max(255),
      street: Joi.string().min(2).max(255),
      houseNumber: Joi.string().min(1).max(50),
      zip: Joi.string().min(1).max(20),
    }).required(),
    image: Joi.object({
      url: Joi.string()
        .uri()
        .allow("")
        .pattern(
          /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
        ),
      alt: Joi.string().min(2).max(255).allow(""),
    }).required(),
    email: Joi.string()
      .pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
      .message("user mail mast be a valid mail")
      .required(),
    password: Joi.string()
      .min(9)
      .max(1024)
      .required()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*'-]).+$/)
      .message(
        "password must be at least 9 characters long and contain an uppercase letter, a lowercase letter, a number and one of the following characters !@#$%^&*-'"
      ),
    isBusiness: Joi.boolean().required(),
    isAdmin: Joi.boolean().allow(""),
    phone: Joi.string()
      .pattern(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
      .message("user phone mast be a valid phone number")
      .required(),
  }).required();

  return schema.validate(user);
}

module.exports = {
  User,
  validateUser,
};
