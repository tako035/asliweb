const nodemailer = require("nodemailer");
const catchAsync = require("../utils/catchAsync");

const sendMail = catchAsync(async (options) => {
  // CREATE TRANSPORTER

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // DEFINE EMAIL OPTIONS

  const mailOptions = {
    from: "M.Tahir KOCAKURT <tkocakurt@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // SEND EMAIL

  await transporter.sendMail(mailOptions);
});

module.exports = sendMail;
