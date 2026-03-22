# Habit Tracker - Quick Start Guide

## 🚀 Quick Start

### Step 1: Start the Backend Server
Open a terminal and run:
```bash
cd server
npm run dev
```

You should see:
```
✓ Database initialized
✓ Server running on http://localhost:3000
✓ Environment: development
```

### Step 2: Start the Frontend Server
Open a **new terminal** and run:
```bash
cd client
npm run dev
```

You should see:
```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open the Application
Open your browser and go to:
**http://localhost:5173**

## 🎯 What You'll See

### Dashboard (Home Page)
- Today's date and progress summary
- Completion percentage
- 4 habit cards:
  1. 🔹 **Coding Practice** (120 minutes target)
  2. 💚 **Jogging / Exercise** (daily)
  3. 🍊 **Eating 2 Amla** (2 count)
  4. 💜 **Course Progress** (daily)

### How to Use
1. Click on any habit card or the "Mark Complete" button to toggle completion
2. Watch your streak counter 🔥 grow with consecutive days
3. Progress bars show your completion percentage
4. Use the navigation bar to switch between Dashboard, Progress, and Settings
5. Toggle between light and dark mode with the theme button

## 🎨 Features to Try

### Dashboard
- Mark habits as complete by clicking them
- See your streak count with the flame icon
- View your daily completion percentage

### Progress Page
- Select different habits from the dropdown
- Switch between Week, Month, and Year views
- See completion statistics

### Settings
- Toggle dark/light theme
- View app information

## 📱 Install as App (PWA)

### On Desktop (Chrome/Edge):
1. Look for the install icon (➕) in the address bar
2. Click "Install"
3. App opens in its own window

### On Mobile:
1. Open in browser (Chrome/Safari)
2. Tap browser menu (3 dots)
3. Select "Add to Home Screen"

## 💡 Tips

- **Start fresh each day**: The dashboard shows today's habits
- **Build streaks**: Complete habits daily to increase your streak
- **Track progress**: Use the Progress page to see trends
- **Dark mode**: Perfect for evening habit tracking
- **Offline mode**: Works without internet after first load

## 🔧 Troubleshooting

**Backend not starting?**
- Make sure port 3000 is free
- Check if Node.js is installed: `node --version`

**Frontend shows errors?**
- Verify backend is running on port 3000
- Check `.env` file in client folder

**Can't access from phone?**
- Both devices must be on same network
- Use your computer's IP instead of localhost

## 📊 Your Daily Routine

1. **Morning**: Open app, review today's habits
2. **Throughout day**: Mark habits as you complete them
3. **Evening**: Check your progress and completion rate
4. **Weekly**: Review Progress page to analyze trends

## 🎯 Next Steps

- Customize habits via API or add UI for habit management
- Track additional metrics and notes
- Set up browser notifications for reminders
- Export your data for analysis

---

**Happy habit tracking! Build consistency, one day at a time.** 🎯

Your backend is on: http://localhost:3000
Your frontend is on: http://localhost:5173

Both servers are currently running! ✅
