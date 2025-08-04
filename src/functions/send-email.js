/* eslint-disable no-undef */
// ampersand-site/netlify/functions/send-email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

exports.handler = async (event) => {
  const { name, email, message } = JSON.parse(event.body);
  const mailOptions = {
    from: email,
    to: "lolwright02@gmail.com",
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};