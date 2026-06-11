const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Setup SMTP transporter if credentials exist
const isSmtpConfigured = process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;

let transporter = null;
if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: parseInt(process.env.EMAIL_PORT || '587', 10) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  console.warn('⚠️ SMTP Email Environment variables not fully configured. Email service will run in MOCK log mode.');
}

/**
 * Send reservation confirmation email
 * @param {Object} resv - Reservation details
 */
exports.sendConfirmationEmail = async (resv) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@shiro.com',
    to: resv.customer_email,
    subject: 'Reservation Confirmed - Shiro Bengaluru',
    text: `Dear ${resv.customer_name},

Your reservation has been confirmed.

Date: ${resv.reservation_date}
Time: ${resv.reservation_time ? resv.reservation_time.slice(0, 5) : ''}
Guests: ${resv.guest_count}

We look forward to serving you at Shiro Bengaluru.

Thank you.`,
  };

  if (transporter) {
    return transporter.sendMail(mailOptions);
  } else {
    console.log('\n==================================================');
    console.log('✉️ [MOCK EMAIL SENT]');
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log('Body:');
    console.log(mailOptions.text);
    console.log('==================================================\n');
    return { messageId: 'mock-id-' + Math.random() };
  }
};

/**
 * Send reservation rejection email
 * @param {Object} resv - Reservation details
 */
exports.sendRejectionEmail = async (resv) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@shiro.com',
    to: resv.customer_email,
    subject: 'Reservation Update - Shiro Bengaluru',
    text: `Dear ${resv.customer_name},

Unfortunately we are unable to confirm your reservation for the requested slot.

Please contact us or make another reservation.

Thank you.`,
  };

  if (transporter) {
    return transporter.sendMail(mailOptions);
  } else {
    console.log('\n==================================================');
    console.log('✉️ [MOCK EMAIL SENT]');
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log('Body:');
    console.log(mailOptions.text);
    console.log('==================================================\n');
    return { messageId: 'mock-id-' + Math.random() };
  }
};
