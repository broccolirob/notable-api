const express = require("express");
const Auth = require("../controllers/auth");
const Password = require("../controllers/password");

const router = express.Router();

router.post("/", Auth.login);

router.post("/register", Auth.register);

router.post("/access-token", Auth.getAccessToken);

router.get("/verify/:verifyToken", Auth.verify);

router.post("/verify/resend", Auth.resendVerifyToken);

router.post("/recover", Password.recover);

router.post("/reset/:resetToken", Password.resetPassword);

module.exports = router;
