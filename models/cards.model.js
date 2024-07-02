const phoneRegex = /0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/;
const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
const webRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const mongoose = require("mongoose");
const Joi = require("joi");
const imageSchema = require("./imageSchema");
const addressSchema = require("./addressSchema");

const cardsSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 256, trim: true, lowercase: true },
  subtitle: { type: String, required: true, minlength: 2, maxlength: 256, trim: true, lowercase: true },
  description: { type: String, required: true, minlength: 2, maxlength: 1024, trim: true, lowercase: true },
  phone: { type: String, required: true, match: phoneRegex },
  email: { type: String, required: true, match: emailRegex, lowercase: true, trim: true },
  web: { type: String, match: webRegex, trim: true, lowercase: true },
  bizNumber: { type: Number, required: true, trim: true, minlength: 7, maxlength: 7 },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [String],
  image: imageSchema,
  address: addressSchema,
  createdAt: { type: Date, default: Date.now, required: true }
});
const Card = mongoose.model("Card", cardsSchema, "cards");

function validateCard(card) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(256).required(),
    subtitle: Joi.string().min(2).max(256).required(),
    description: Joi.string().min(2).max(1024).required(),
    phone: Joi.string().pattern(phoneRegex).message('card "phone" must be a valid phone number').required(),
    email: Joi.string().pattern(emailRegex).message('card "email" must be a valid email address').required(),
    web: Joi.string().pattern(webRegex).message('card "web" must be a valid URL').allow(""),
    image: Joi.object({
      url: Joi.string().uri().allow("").pattern(webRegex),
      alt: Joi.string().min(2).max(255).allow("")
    }).required(),
    address: Joi.object({
      state: Joi.string().min(2).max(255).allow(""),
      country: Joi.string().min(2).max(255).required(),
      city: Joi.string().min(2).max(255).required(),
      street: Joi.string().min(2).max(255).required(),
      houseNumber: Joi.string().min(1).max(50).required(),
      zip: Joi.string().min(1).max(20).required()
    }).required(),
    bizNumber: Joi.number().required(),
    user_id: Joi.string().optional()
  });

  return schema.validate(card);
}

module.exports = {
  Card,
  validateCard,
};
