const nodemailer = require("nodemailer");
require("dotenv").config();

const { MAILTRAP_USER, MAILTRAP_PASS } = process.env;

const emailTransport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASS,
  },
});

const sendEmail = async (to, subject, html = "", text = "") => {
  const emailConfig = {
    to,
    subject,
    html,
    text,
    from: "Todos app admin <kravchenko@example.com>",
  };

  await emailTransport
    .sendMail(emailConfig)
    .then((info) => console.log(info))
    .catch((err) => console.log(err));
};

module.exports = sendEmail;
