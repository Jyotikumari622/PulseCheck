const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password, not your real password
  },
});

const sendStatusAlert = async ({ to, siteName, siteUrl, newStatus }) => {
  const isDown = newStatus === 'down';

  const subject = isDown ? `🔴 ${siteName} is DOWN` : `🟢 ${siteName} is back UP`;
  const text = isDown
    ? `Your monitored site "${siteName}" (${siteUrl}) just went DOWN at ${new Date().toLocaleString()}.`
    : `Good news — "${siteName}" (${siteUrl}) is back UP as of ${new Date().toLocaleString()}.`;

  try {
    await transporter.sendMail({
      from: `"Uptime Monitor" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`Alert email sent to ${to}: ${subject}`);
  } catch (err) {
    // Don't crash the cron job if email fails — just log it
    console.error('Failed to send alert email:', err.message);
  }
};

module.exports = { sendStatusAlert };
