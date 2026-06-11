const { Resend } = require('resend');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const isResendConfigured = !!process.env.RESEND_API_KEY;
let resend = null;

if (isResendConfigured) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend Email Integration initialized.');
} else {
  console.warn('⚠️ RESEND_API_KEY is not configured. Email service will run in MOCK log mode.');
}

/**
 * Send reservation confirmation email
 * @param {Object} resv - Reservation details
 */
exports.sendConfirmationEmail = async (resv) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
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

  if (resend) {
    try {
      const data = await resend.emails.send(mailOptions);
      if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
      }
      console.log(`✅ [Render Logs] [Resend] Confirmation email sent successfully to ${resv.customer_email}. Email ID: ${data.data?.id}`);
      return data.data;
    } catch (err) {
      console.error(`❌ [Render Logs] [Resend] Confirmation email failed for ${resv.customer_email}:`, err.message);
      throw err;
    }
  } else {
    console.log('\n==================================================');
    console.log('✉️ [MOCK EMAIL SENT VIA RESEND]');
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log('Body:');
    console.log(mailOptions.text);
    console.log('==================================================\n');
    return { id: 'mock-resend-id-' + Math.random() };
  }
};

/**
 * Send reservation rejection email
 * @param {Object} resv - Reservation details
 */
exports.sendRejectionEmail = async (resv) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    to: resv.customer_email,
    subject: 'Reservation Update - Shiro Bengaluru',
    text: `Dear ${resv.customer_name},

Unfortunately we are unable to confirm your reservation for the requested slot.

Please contact us or make another reservation.

Thank you.`,
  };

  if (resend) {
    try {
      const data = await resend.emails.send(mailOptions);
      if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
      }
      console.log(`✅ [Render Logs] [Resend] Rejection email sent successfully to ${resv.customer_email}. Email ID: ${data.data?.id}`);
      return data.data;
    } catch (err) {
      console.error(`❌ [Render Logs] [Resend] Rejection email failed for ${resv.customer_email}:`, err.message);
      throw err;
    }
  } else {
    console.log('\n==================================================');
    console.log('✉️ [MOCK EMAIL SENT VIA RESEND]');
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log('Body:');
    console.log(mailOptions.text);
    console.log('==================================================\n');
    return { id: 'mock-resend-id-' + Math.random() };
  }
};

/**
 * Send custom test email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 */
exports.sendTestEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    to,
    subject,
    text,
  };

  if (resend) {
    try {
      const data = await resend.emails.send(mailOptions);
      if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
      }
      console.log(`✅ [Render Logs] [Resend] Test email sent successfully to ${to}. Email ID: ${data.data?.id}`);
      return data.data;
    } catch (err) {
      console.error(`❌ [Render Logs] [Resend] Test email failed for ${to}:`, err.message);
      throw err;
    }
  } else {
    console.log('\n==================================================');
    console.log('✉️ [MOCK TEST EMAIL SENT VIA RESEND]');
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log('Body:');
    console.log(mailOptions.text);
    console.log('==================================================\n');
    return { id: 'mock-test-resend-id-' + Math.random() };
  }
};
