const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const ROOT = "https://s3.amazonaws.com/mybucket";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 24,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  role: {
    type: String,
    default: "user",
    required: true,
    enum: ["admin", "staff", "user"],
  },
  photoURL: {
    type: String,
    get: (v) => (v ? `${ROOT}${v}` : ""),
  },
  emailConfirmed: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, config.get("jwt.key"), {
    expiresIn: config.get("jwt.exp"),
  });
};

const User = mongoose.model("User", userSchema);

// TODO: username unique (lowercase for checking, but save with original case)

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(5).max(24).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    role: Joi.string(),
    photoURL: Joi.string(),
    emailConfirmed: Joi.boolean(),
  });

  return schema.validate(user);
}

module.exports = { User, validateUser };
