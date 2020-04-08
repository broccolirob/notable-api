const sgMail = require("@sendgrid/mail");
const config = require("config");

sgMail.setApiKey(config.get("sendgrid.key"));

function sendMail(mailOptions) {
  return new Promise((resolve, reject) => {
    sgMail.send(mailOptions, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

module.exports = { sendMail };
