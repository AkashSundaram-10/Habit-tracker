# 🎯 Habit Tracker

A modern, full-stack habit tracking application built with React, Node.js, and SQLite. Track your daily habits, visualize progress, and build consistent routines.

## ✨ Features

- **📊 Dashboard**: View today's habits with completion status and streaks
- **🔥 Streak Tracking**: Monitor consecutive days of habit completion
- **📈 Progress Visualization**: Track completion rates and statistics
- **🌓 Dark Mode**: Beautiful UI with light and dark themes
- **📱 PWA Support**: Install as a mobile or desktop app
- **💾 Offline Support**: Work offline with service worker caching
- **🎨 Clean UI**: Modern, responsive design with Tailwind CSS

## 🎯 Your Habits

This app is pre-configured to track:
1. **Coding Practice** - 2 hours per day
2. **Jogging / Exercise** - Daily physical activity
3. **Eating 2 Amla** - Daily health habit
4. **Course Progress** - Learning new skills

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **date-fns** - Date handling
- **Vite PWA Plugin** - Progressive Web App support

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **SQLite** (sql.js) - Database
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup

1. **Clone or navigate to the project directory**

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../client
npm install
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd server
npm run dev
```

Backend will run on: http://localhost:3000

### Start Frontend Development Server

```bash
cd client
npm run dev
```

Frontend will run on: http://localhost:5173

### Access the Application

Open your browser and go to: **http://localhost:5173**

## 📂 Project Structure

```
habit-tracker/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── HabitCard.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Progress.jsx
│   │   │   └── Settings.jsx
│   │   ├── hooks/         # Custom React hooks
│   │   │   └── useTheme.js
│   │   ├── services/      # API integration
│   │   │   └── api.js
│   │   └── utils/         # Utility functions
│   │       └── dateHelpers.js
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── database/      # Database setup
│   │   │   ├── db.js
│   │   │   └── schema.sql
│   │   ├── routes/        # API routes
│   │   │   ├── habits.js
│   │   │   └── tracking.js
│   │   ├── controllers/   # Business logic
│   │   │   ├── habitController.js
│   │   │   └── trackingController.js
│   │   └── server.js      # Express app entry
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit

### Tracking
- `GET /api/tracking/today` - Get today's habits with completion status
- `GET /api/tracking/date/:date` - Get habits for specific date
- `POST /api/tracking/toggle` - Toggle habit completion
- `GET /api/tracking/streak/:habit_id` - Get streak for a habit
- `GET /api/tracking/stats/:habit_id` - Get habit statistics

### Analytics
- `GET /api/tracking/analytics/overview` - Overall statistics
- `GET /api/tracking/analytics/calendar/:month` - Monthly calendar data

## 🎨 Features in Detail

### Dashboard
- View all habits for today
- Quick completion toggle
- Visual progress bars
- Streak indicators with flame icon
- Completion percentage

### Progress Page
- Habit-specific statistics
- Completion rates
- Time period filters (week/month/year)
- Visual charts (coming soon)

### Settings
- Dark/Light theme toggle
- Data export/import (coming soon)
- App information

### PWA Features
- Install on mobile devices
- Install on desktop (Chrome, Edge)
- Offline functionality
- App-like experience

## 💾 Database Schema

### habits table
- `id` - Primary key
- `name` - Habit name
- `description` - Description
- `target_value` - Target value (e.g., 120 minutes)
- `target_unit` - Unit (minutes, count, boolean)
- `icon` - Icon name (Lucide icon)
- `color` - Hex color code
- `is_active` - Active status

### habit_logs table
- `id` - Primary key
- `habit_id` - Foreign key to habits
- `date` - Log date
- `completed` - Completion status
- `value` - Actual value achieved
- `notes` - Optional notes

## 🔧 Configuration

### Environment Variables

**Backend** (`server/.env`):
```env
PORT=3000
NODE_ENV=development
DB_PATH=./habit-tracker.db
```

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:3000/api
```

## 🚀 Building for Production

### Build Frontend
```bash
cd client
npm run build
```

Output will be in `client/dist/`

### Serve Production Build
```bash
npm run preview
```

## 📱 Installing as PWA

### On Mobile (Android/iOS)
1. Open the app in your browser
2. Tap the browser menu (3 dots)
3. Select "Add to Home Screen" or "Install App"

### On Desktop (Chrome/Edge)
1. Open the app in your browser
2. Look for the install icon in the address bar
3. Click "Install" when prompted

## 🎯 Usage Tips

1. **Start your day** by opening the dashboard
2. **Mark habits complete** as you finish them
3. **Track your streaks** and stay motivated
4. **Review progress** weekly to see trends
5. **Use dark mode** for evening tracking

## 🛠️ Customization

### Adding New Habits

Via API:
```bash
curl -X POST http://localhost:3000/api/habits \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Reading",
    "description": "Read for 30 minutes",
    "target_value": 30,
    "target_unit": "minutes",
    "icon": "Book",
    "color": "#3b82f6"
  }'
```

### Available Icons
Use any [Lucide React](https://lucide.dev/icons/) icon name:
- Code, Activity, Apple, BookOpen
- Coffee, Heart, Music, Target, etc.

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3000 is available
- Ensure Node.js 18+ is installed
- Delete `habit-tracker.db` and restart to reset database

### Frontend shows API errors
- Ensure backend is running on port 3000
- Check browser console for CORS errors
- Verify `.env` file has correct API URL

### PWA won't install
- Use HTTPS in production (required for PWA)
- Check browser console for service worker errors
- Try in Chrome/Edge (best PWA support)

## 📝 Future Enhancements

- [ ] Habit management UI (add/edit/delete from frontend)
- [ ] Detailed progress charts with Recharts
- [ ] Browser notifications for reminders
- [ ] Data export/import functionality
- [ ] Habit categories and tags
- [ ] Weekly/monthly goals
- [ ] Achievements and milestones
- [ ] Social sharing features

## 👨‍💻 Author

**Akash Kumar**
- Coding student passionate about productivity and personal growth
- Building this app to improve daily habits and software development skills

## 📄 License

MIT License - Feel free to use this project for personal or educational purposes.

## 🙏 Acknowledgments

- React and Vite teams for excellent developer experience
- Tailwind CSS for beautiful, utility-first styling
- Lucide for the amazing icon library
- The open-source community

---

**Built with ❤️ for personal growth and consistency**

Start tracking your habits today and build the life you want, one day at a time! 🎯
