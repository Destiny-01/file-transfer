const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async ({ from, to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `Sharp Share ${from}`,
    to,
    subject,
    text,
    html,
  });
};

// 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
