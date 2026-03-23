# 📁 Habit Tracker - Project Structure

## Overview
This is a **full-stack habit tracking application** with separated frontend and backend.

```
Habit Tracker/
│
├── 🎨 FRONTEND (client/)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx          ← Dashboard with habits
│   │   │   ├── Progress.jsx      ← Analytics & charts
│   │   │   ├── Reminders.jsx     ← Reminder management
│   │   │   └── Settings.jsx      ← Habit CRUD
│   │   ├── components/
│   │   │   └── Navbar.jsx        ← Bottom navigation
│   │   ├── services/
│   │   │   └── api.js            ← API calls to backend
│   │   ├── utils/
│   │   │   └── dateHelpers.js    ← Date utilities
│   │   └── index.css             ← Tailwind + animations
│   ├── package.json              ← Frontend dependencies
│   └── vite.config.js            ← Vite configuration
│
├── 🔧 BACKEND (server/)
│   ├── src/
│   │   ├── server.js             ← Express server
│   │   └── database.js           ← SQLite setup
│   ├── database.db               ← SQLite database file
│   └── package.json              ← Backend dependencies
│
└── 📦 DEPLOYMENT CONFIG (root)
    ├── vercel-frontend.json      ← Frontend deployment (Vercel)
    ├── railway-backend.json      ← Backend deployment (Railway)
    ├── DEPLOYMENT.md             ← Full deployment guide
    └── PROJECT-STRUCTURE.md      ← This file
```

---

## 🎨 FRONTEND Stack

**Framework:** React 19.2.4 with Vite 8.0.1
**Styling:** Tailwind CSS 4.2.2
**UI Icons:** Lucide React
**Charts:** Recharts
**HTTP Client:** Axios
**Routing:** React Router DOM

**Deploy to:** Vercel ✅

---

## 🔧 BACKEND Stack

**Runtime:** Node.js
**Framework:** Express
**Database:** SQLite
**CORS:** Enabled for frontend

**Deploy to:** Railway ✅

---

## 🚀 How to Run Locally

### Start Backend (Terminal 1)
```bash
cd server
npm install
npm start
```
Backend runs on: `http://localhost:5000`

### Start Frontend (Terminal 2)
```bash
cd client
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🌐 How to Deploy

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete guide.

**Quick version:**
1. Deploy frontend to Vercel: `vercel --prod`
2. Deploy backend to Railway: `cd server && railway up`
3. Connect them with environment variables

---

## 🔗 API Endpoints (Backend)

```
GET    /api/habits           - Get all habits
POST   /api/habits           - Create new habit
PUT    /api/habits/:id       - Update habit
DELETE /api/habits/:id       - Delete habit

GET    /api/tracking/today   - Get today's tracking
GET    /api/tracking/:date   - Get tracking by date
POST   /api/tracking/toggle  - Toggle habit completion
```

---

## 📝 Key Features

✅ Daily habit tracking with streaks
✅ Weekly and monthly progress analytics
✅ Custom reminders (stored locally)
✅ Colorful UI with animations
✅ Mobile-responsive design
✅ Motivational quotes
✅ Live clock and date display
✅ 6 predefined habit types with icons

---

## 👤 User: Akash Kumar

This is a personalized habit tracker built for daily use.
