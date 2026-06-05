const cron = require('node-cron');
const supabase = require('./supabase');
const { sendReminder } = require('./twilio');

function startReminderJob() {
  // Runs every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('Checking for upcoming appointments...');

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    // Get appointments within next 1 hour that haven't been reminded yet
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('reminder_sent', false)
      .gte('appointment_time', now.toISOString())
      .lte('appointment_time', oneHourLater.toISOString());

    if (error) {
      console.error('Reminder job DB error:', error.message);
      return;
    }

    for (const appt of data) {
      const sent = await sendReminder(
        appt.phone_number,
        appt.customer_name,
        appt.appointment_time
      );

      if (sent) {
        // Mark reminder as sent so we don't send twice
        await supabase
          .from('appointments')
          .update({ reminder_sent: true })
          .eq('id', appt.id);
      }
    }
  });

  console.log('Reminder job started.');
}

module.exports = { startReminderJob };