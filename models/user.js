const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { VerifyToken } = require("./verifyToken");

const ROOT = "https://s3.amazonaws.com/mybucket";

const userSchema = new mongoose.Schema(
  {
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
    emailConfirmed: {
      type: Boolean,
      default: false,
      required: true,
    },
    photoURL: {
      type: String,
      get: (v) => (v ? `${ROOT}${v}` : ""),
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this._id,
    email: this.email,
    username: this.username,
  };

  return jwt.sign(payload, config.get("jwt.key"), {
    expiresIn: config.get("jwt.exp"),
  });
};

userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 36000000;
};

userSchema.methods.generateVerificationToken = function () {
  let payload = {
    userId: this._id,
    token: crypto.randomBytes(20).toString("hex"),
  };

  return new VerifyToken(payload);
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
