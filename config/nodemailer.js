const nodemailer = require("nodemailer");
const { EMAIL_PASSWORD } = require("./env");

const accountEmail = "chalie2123@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: accountEmail,
    pass: EMAIL_PASSWORD,
  },
});

module.exports = {
  accountEmail,
  transporter,
};
