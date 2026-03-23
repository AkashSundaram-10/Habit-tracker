# Deploy Habit Tracker - Full Stack

## 📋 Project Structure
```
Habit Tracker/
├── client/           ← FRONTEND (React + Vite)
└── server/           ← BACKEND (Node.js + SQLite)
```

---

# 🎨 FRONTEND DEPLOYMENT (Vercel)

## Overview
Deploy your React frontend to Vercel for fast, global CDN hosting.

## Configuration File
The `vercel-frontend.json` in root directory contains your frontend config:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ],
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "cd client && npm install"
}
```

## Step 1: Deploy Frontend to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy from project root
cd "d:/Projects/Habit Tracker myself"
vercel --prod
```

### Option B: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel auto-detects the configuration from `vercel-frontend.json`
6. Click "Deploy"

## Step 2: Update Environment Variables

After deployment, you'll need to connect frontend to your backend:

**In Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://your-backend-url.railway.app/api`

**Or create `client/.env`:**
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

---

# 🔧 BACKEND DEPLOYMENT (Railway)

## Overview
⚠️ **Important:** Vercel doesn't support SQLite (ephemeral filesystem). Deploy backend to Railway instead.

## Configuration File
The `railway-backend.json` in root directory contains your backend config.

## Step 1: Deploy Backend to Railway

### Using Railway CLI

```bash
# Install Railway CLI globally
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to server directory
cd "d:/Projects/Habit Tracker myself/server"

# Initialize Railway project
railway init

# Deploy
railway up
```

### Using Railway Dashboard

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Set root directory to `/server`
6. Railway will auto-deploy

## Step 2: Get Your Backend URL

After deployment, Railway provides a URL like:
```
https://your-app-name.up.railway.app
```

Copy this URL and use it in your frontend's `VITE_API_URL`.

## Step 3: Enable CORS

Make sure your backend allows requests from your Vercel frontend:

**In `server/src/server.js`:**
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'https://your-app.vercel.app'
}));
```

---

# 🚀 QUICK DEPLOYMENT GUIDE

## Simplified Steps:

### 1. Deploy Frontend (Vercel)
```bash
cd "d:/Projects/Habit Tracker myself"
vercel --prod
```

### 2. Deploy Backend (Railway)
```bash
cd "d:/Projects/Habit Tracker myself/server"
railway up
```

### 3. Connect Them
- Copy Railway backend URL
- Add it to Vercel environment variables as `VITE_API_URL`
- Redeploy frontend on Vercel

---

# ✅ POST-DEPLOYMENT CHECKLIST

## Frontend (Vercel)
- [ ] Deployment successful
- [ ] Custom domain configured (optional)
- [ ] Environment variable `VITE_API_URL` set to Railway backend URL
- [ ] Site loads correctly
- [ ] No CORS errors in browser console

## Backend (Railway)
- [ ] Deployment successful
- [ ] Database file persists between requests
- [ ] CORS configured for Vercel frontend domain
- [ ] All API endpoints working
- [ ] SQLite database initialized

## Integration
- [ ] Frontend can fetch data from backend
- [ ] Habit creation works
- [ ] Habit completion/tracking works
- [ ] Data persists after backend restarts

---

# ⚠️ IMPORTANT NOTES

## Why Not Full-Stack on Vercel?
❌ **SQLite Problem:**
- Vercel uses serverless functions with **ephemeral filesystem**
- SQLite database file would be **lost after each deployment**
- Data would **reset** every time the function restarts

✅ **Recommended Solution:**
- **Frontend:** Vercel (fast CDN, optimized for React)
- **Backend:** Railway (persistent filesystem, supports SQLite)
- **Alternative:** Migrate to PostgreSQL and use Vercel Postgres

---

# 🔧 TROUBLESHOOTING

## CORS Error
**Problem:** Browser shows CORS policy error

**Solution:** Update backend CORS configuration
```javascript
// server/src/server.js
const cors = require('cors');
app.use(cors({
  origin: 'https://your-frontend.vercel.app' // Your Vercel URL
}));
```

## API Not Working
**Problem:** Frontend can't connect to backend

**Checklist:**
1. Verify `VITE_API_URL` in Vercel environment variables
2. Check Railway backend is deployed and running
3. Test backend URL directly in browser: `https://your-backend.railway.app/api/habits`
4. Check browser console for errors

## Build Errors on Vercel
**Problem:** Deployment fails during build

**Solutions:**
1. Check Vercel build logs in dashboard
2. Ensure `client/package.json` has correct build script
3. Verify all dependencies are in `dependencies` (not `devDependencies`)
4. Try building locally first: `cd client && npm run build`

## Database Empty After Railway Deploy
**Problem:** Database resets or is empty

**Solution:**
- Railway persists files by default
- Check if `server/database.db` is in `.gitignore`
- Initialize database on first run with seed data

---

# 📦 ALTERNATIVE: PostgreSQL (Production Recommended)

If you want everything on Vercel or need a production database:

## Step 1: Create Vercel Postgres
```bash
vercel postgres create
```

## Step 2: Update Backend
```bash
cd server
npm install pg
```

## Step 3: Migrate Code
Replace SQLite queries with PostgreSQL queries using `pg` library.

---

# 📝 SUMMARY

**Current Setup (Recommended):**
```
Frontend (React) → Vercel
Backend (Node.js + SQLite) → Railway
```

**Configuration Files:**
- `vercel-frontend.json` → Frontend deployment config
- `railway-backend.json` → Backend deployment config
- `DEPLOYMENT.md` → This guide

**Deploy Commands:**
```bash
# Deploy Frontend
vercel --prod

# Deploy Backend
cd server && railway up
```
