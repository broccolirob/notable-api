const config = require("config");
const { User } = require("../models/user");
const { sendMail } = require("../utils");

async function recover(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res
        .status(400)
        .json({ error: { message: "The email provided could not be found." } });

    user.generatePasswordReset();

    await user.save();

    let subject = "Password change request";
    let to = user.email;
    let from = config.get("sendgrid.from");
    let link = `${config.get("baseURL")}/api/auth/reset/${
      user.resetPasswordToken
    }`;
    let html = `<p>Hi ${user.username}</p>
                <p>Please click on the following <a href="${link}">link</a> to reset your password.</p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

    await sendMail({ to, from, subject, html });
    res
      .status(200)
      .json({ message: "A reset email has been sent to " + user.email });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
}

async function resetPassword(req, res) {
  try {
    const { resetToken } = req.params;

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        error: { message: "Password reset token is invalid or has expired." },
      });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.emailConfirmed = true;

    await user.save();

    let subject = "Your password has been changed";
    let to = user.email;
    let from = config.get("sendgrid.from");
    let html = `<p>Hi ${user.username}</p>
                <p>This is a confirmation that the password for account ${user.email} has just been changed.</p>`;

    await sendMail({ to, from, subject, html });

    res.status(200).json({ message: "Your password has been updated" });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
}

module.exports = { recover, resetPassword };
