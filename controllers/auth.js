const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const { User } = require("../models/user");
const { VerifyToken } = require("../models/verifyToken");
const { sendMail } = require("../utils");

async function register(req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send({ error: "User is already registered." });

    user = new User(_.pick(req.body, ["username", "email", "password"]));

    const user_ = await user.save();

    await sendVerificationEmail(user_, req, res);
  } catch (err) {
    console.log(err);
    res.send({ message: err });
  }
}

async function login(req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send({
        error: { message: "Invalid email or password" },
      });

    if (!user.comparePassword(req.body.password))
      return res.status(400).send({
        error: { message: "Invalid email or password" },
      });

    if (!user.emailConfirmed)
      return res.status(400).json({
        error: {
          message:
            "Account is unverified. Check your email for verification link",
        },
      });

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
    res.status(500).json({ error: { message: err.message } });
  }
}

async function verify(req, res) {
  if (!req.params.verifyToken)
    return res.status(400).json({
      error: { message: "We were unable to find a user for this token." },
    });
  try {
    const token = await VerifyToken.findOne({ token: req.params.verifyToken });
    if (!token)
      return res.status(400).json({
        error: { message: "We were unable to find a user for this token." },
      });

    let user = await User.findOne({ _id: token.userId });

    if (!user)
      return res.status(400).json({
        error: { message: "We were unable to find a user for this token." },
      });

    if (user.emailConfirmed)
      return res.status(400).json({
        error: { message: "This user has already confirmed their email." },
      });

    user.emailConfirmed = true;
    await user.save();
    res.status(200).send("Your account has been verified. Please log in.");
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
}

async function resendVerifyToken(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).json({
        message:
          "The email address " +
          req.body.email +
          " is not associated with any account. Double-check your email address and try again.",
      });

    if (user.emailConfirmed)
      return res.status(400).json({
        message: "This account has already been verified. Please log in.",
      });

    await sendVerificationEmail(user, req, res);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
}

async function getAccessToken(req, res) {
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
    console.error(err);
    res.status(401).send({ error: "Invalid access token detected" });
  }
}

async function sendVerificationEmail(user, req, res) {
  try {
    const verifyToken = user.generateVerificationToken();

    await verifyToken.save();

    let subject = "Welcome to Notable! Confirm Your Email";
    let to = user.email;
    let from = config.get("sendgrid.from");
    let link = `${config.get("baseURL")}/api/auth/verify/${verifyToken.token}`;
    let html = `<p>Welcome ${user.username}</p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p>`;

    await sendMail({ to, from, subject, html });

    res.send({
      message: `A verification email has been sent to ${user.email}.`,
    });
  } catch (err) {
    res.send({ error: { message: err.message } });
  }
}

module.exports = { register, login, verify, resendVerifyToken, getAccessToken };
