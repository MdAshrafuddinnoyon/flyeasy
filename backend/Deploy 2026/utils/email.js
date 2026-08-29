const nodemailer = require('nodemailer');
const pool = require('../config/db');

const getSiteContent = async () => {
  const [rows] = await pool.query("SELECT * FROM site_content LIMIT 1");
  return rows[0] || {};
};

const sendEmail = async (to, subject, text, html) => {
  try {
    const siteData = await getSiteContent();

    const host = siteData.smtp_host || process.env.SMTP_HOST || 'smtp.hostinger.com';
    const port = parseInt(siteData.smtp_port || process.env.SMTP_PORT || '465', 10);
    const user = siteData.smtp_user || process.env.SMTP_USER;
    const pass = siteData.smtp_pass || process.env.SMTP_PASS;
    const senderName = siteData.email_sender_name || 'FlyEasy';
    const senderEmail = siteData.email_sender_email || user;

    if (!user || !pass) {
      console.warn("SMTP credentials not fully configured.");
      return { success: false, error: 'SMTP credentials missing' };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email: ", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail, getSiteContent };
