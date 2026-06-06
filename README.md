# 📅 WhatsApp Appointment Reminder System
vercel link - https://whatsapp-reminder-system-r2wdd7htz.vercel.app/

A full-stack appointment booking system that sends instant WhatsApp confirmations and automatic reminders — built for the Better Call Centers / El Paso Water Quality practical test.

---

## ✨ Features

- **Booking Form** — Enter customer name, phone number, and appointment time
- **WhatsApp Confirmation** — Sends an instant WhatsApp message via Twilio on every booking
- **Live Dashboard** — Shows all appointments with real-time status badges
- **Auto Reminders** — Cron job checks every 5 minutes and sends a WhatsApp reminder if an appointment is within 1 hour
- **Stats Bar** — Total, Confirmed, and Reminded counts at a glance
- **Input Validation** — Phone format check, future-date check, confirmation dialog before booking

---

## 🛠 Tech Stack

| Layer | Tool |
|---|---|
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| Messaging | Twilio WhatsApp Sandbox |
| Frontend | HTML + CSS + Vanilla JS |
| Hosting | Vercel / Local |

---

## 📁 Project Structure

```
appointment-system/
├── public/
│   └── index.html       # Booking form + live dashboard
├── server.js            # Express API (POST + GET /api/appointments)
├── supabase.js          # Supabase client setup
├── twilio.js            # WhatsApp confirmation + reminder logic
├── reminder.js          # node-cron job (checks every 5 min)
├── .env                 # API keys (not committed)
└── package.json
```

---

## ⚙️ Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/appointment-system.git
cd appointment-system
npm install
```

### 2. Create your `.env` file

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
PORT=3000
```

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → create a free project
2. Open the **SQL Editor** and run:

```sql
create table appointments (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  phone_number text not null,
  appointment_time timestamp not null,
  confirmation_sent boolean default false,
  reminder_sent boolean default false,
  created_at timestamp default now()
);
```

3. Copy your **Project URL** and **anon public key** from Project Settings → API → paste into `.env`

### 4. Set up Twilio WhatsApp Sandbox

1. Sign up free at [twilio.com](https://twilio.com)
2. Go to **Messaging → Try it out → Send a WhatsApp message**
3. Follow the sandbox activation steps (send a join code from your phone)
4. Copy your **Account SID** and **Auth Token** → paste into `.env`

### 5. Run locally

```bash
node server.js
```

Open `http://localhost:3000` in your browser.

---

## 🔄 How Data Flows

```
User fills form
     ↓
POST /api/appointments  (Express)
     ↓
Save to Supabase DB
     ↓
Twilio API → WhatsApp confirmation sent
     ↓
Dashboard fetches GET /api/appointments → live table renders
     ↓
Cron job (every 5 min) → finds appointments within 1 hour
     ↓
Twilio API → WhatsApp reminder sent → reminder_sent = true
```

---

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add all `.env` variables in your Vercel project dashboard under **Settings → Environment Variables**.

---

## 📝 Written Explanation

Built with Node.js/Express for the backend, Supabase as the hosted PostgreSQL database, and Twilio's WhatsApp sandbox for messaging. When a user submits the booking form, the appointment is saved to Supabase via the JS client, and a WhatsApp confirmation is immediately dispatched through the Twilio API. The dashboard fetches all appointments live on every page load and refresh, showing real-time status badges. For the bonus reminder feature, a `node-cron` job runs every 5 minutes, queries Supabase for any appointments within the next 60 minutes where `reminder_sent = false`, fires a WhatsApp reminder via Twilio, and then marks the record as reminded so it doesn't trigger again. The trickiest part was handling timezone differences between the browser's local datetime input and the UTC timestamps stored in Supabase — solved by converting with `new Date().toISOString()` on submit and `toLocaleString()` on display.

---

## ⏱ Time Taken

Approximately **7–8 hours** total across setup, coding, testing, and UI polish.

---

## 📸 Screenshots

> *(Add a screenshot of the dashboard here)*

---

## 📄 License

MIT
