const cron = require('node-cron');
const supabase = require('./supabase');
const { sendReminder } = require('./twilio');

function startReminderJob() {
  // Runs every 1 minute
  cron.schedule('* * * * *', async () => {
    console.log('Checking for upcoming appointments...');

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('reminder_sent', false);

    if (error) {
      console.error('Reminder job DB error:', error.message);
      return;
    }

    console.log(`Appointments found: ${data.length}`);

    const now = new Date();

    for (const appt of data) {
      const appointmentTime = new Date(appt.appointment_time);
      const diffMinutes = (appointmentTime - now) / (1000 * 60);

      // Send reminder only if appointment is within next 60 minutes
      if (diffMinutes > 0 && diffMinutes <= 60) {
        console.log(`Sending reminder to: ${appt.customer_name}`);

        const sent = await sendReminder(
          appt.phone_number,
          appt.customer_name,
          appt.appointment_time
        );

        if (sent) {
          await supabase
            .from('appointments')
            .update({ reminder_sent: true })
            .eq('id', appt.id);

          console.log('Reminder sent successfully');
        }
      }
    }
  });

  console.log('Reminder job started.');
}

module.exports = { startReminderJob };