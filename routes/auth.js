const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  console.log(req.body);
  return res.status(400).send("Hi! It's your server, bitch. You hit api/auth/");
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  return res
    .status(400)
    .send("Hi! It's your server, bitch. You hit api/auth/register");
});

router.post("/access-token", async (req, res) => {
  console.log(req.body);
  return res
    .status(400)
    .send("Hi! It's your server, bitch. You hit api/auth/access-token");
});

router.post("/user/update", async (req, res) => {
  console.log(req.body);
  return res
    .status(400)
    .send("Hi! It's your server, bitch. You hit api/auth/user/update");
});

module.exports = router;
