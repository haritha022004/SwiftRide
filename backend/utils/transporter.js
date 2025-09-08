const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sainikhilchitra@gmail.com", // your Gmail
    pass: "olqb qgrs rutr iqou",       // App Password
  },
});

module.exports = transporter;