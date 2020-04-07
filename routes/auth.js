const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const Joi = require("@hapi/joi");
const { User, validateUser } = require("../models/user");

const router = express.Router();

router.post("/user/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User is already registered.");

  user = new User(_.pick(req.body, ["username", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res.send({
    user: _.pick(user, [
      "_id",
      "username",
      "email",
      "role",
      "photoURL",
      "emailConfirmed",
    ]),
    token: token,
  });
});

router.post("/", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();

  res.send({
    user: _.pick(user, [
      "_id",
      "username",
      "email",
      "role",
      "photoURL",
      "emailConfirmed",
    ]),
    token: token,
  });
});

router.post("/access-token", async (req, res) => {
  const req_token = req.body.token;

  try {
    const { id } = jwt.verify(req_token, config.get("jwt.key"));

    const user = await User.findById(id);

    const token = user.generateAuthToken();

    res.send({
      user: _.pick(user, [
        "_id",
        "username",
        "email",
        "role",
        "photoURL",
        "emailConfirmed",
      ]),
      token: token,
    });
  } catch (err) {
    console.log(err.message);
    console.error(err);
    res.status(401).send("Invalid access token detected");
  }
});

router.post("/user/update", async (req, res) => {
  console.log(req.body);
  return res.status(400).send("Hi! You hit api/auth/user/update");
});

function validateLogin(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
