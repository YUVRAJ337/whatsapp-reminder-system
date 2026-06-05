const twilio = require('twilio');
require('dotenv').config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendConfirmation(toPhone, customerName, appointmentTime) {
  const formattedTime = new Date(appointmentTime).toLocaleString();
  
  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      // ⬇️ THIS is where the real customer number goes
      to: `whatsapp:${toPhone}`,
      body: `Hi ${customerName}! Your appointment is confirmed for ${formattedTime}. See you soon!`
    });
    console.log('Confirmation sent:', message.sid);
    return true;
  } catch (err) {
    console.error('Twilio error:', err.message);
    return false;
  }
}

async function sendReminder(toPhone, customerName, appointmentTime) {
  const formattedTime = new Date(appointmentTime).toLocaleString();

  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${toPhone}`,
      body: `Reminder: Hi ${customerName}, your appointment is in less than 1 hour at ${formattedTime}. Please be ready!`
    });
    console.log('Reminder sent:', message.sid);
    return true;
  } catch (err) {
    console.error('Twilio reminder error:', err.message);
    return false;
  }
}

module.exports = { sendConfirmation, sendReminder };