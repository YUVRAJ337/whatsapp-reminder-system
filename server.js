const express = require('express');
const cors = require('cors');
require('dotenv').config();

const supabase = require('./supabase');
const { sendConfirmation } = require('./twilio');
const { startReminderJob } = require('./reminder');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serves your HTML form

// ✅ POST - Save appointment + send confirmation
app.post('/api/appointments', async (req, res) => {
  const { customer_name, phone_number, appointment_time } = req.body;
  const cleanedPhone = phone_number.replace(/\s+/g, '');

  // Basic validation
  if (!customer_name || !cleanedPhone || !appointment_time) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Save to Supabase
  const { data, error } = await supabase
    .from('appointments')
    .insert([{ customer_name, phone_number: cleanedPhone, appointment_time }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Send WhatsApp confirmation
  await sendConfirmation(cleanedPhone, customer_name, appointment_time);

  // Update confirmation_sent flag
  await supabase
    .from('appointments')
    .update({ confirmation_sent: true })
    .eq('id', data[0].id);

  res.status(201).json({ success: true, appointment: data[0] });
});

// ✅ GET - Fetch all appointments for dashboard
app.get('/api/appointments', async (req, res) => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_time', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Start the reminder cron job
startReminderJob();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});