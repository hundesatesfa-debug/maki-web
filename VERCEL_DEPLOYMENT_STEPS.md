# 🚀 Deploy MAKI to Vercel - Step by Step

**Status**: Ready to deploy  
**Time**: 10-15 minutes  
**Cost**: Free

---

## 📋 What You'll Do

1. **Deploy Frontend** on Vercel (Next.js)
2. **Deploy Backend** on Railway (Express + Node.js)
3. **Configure Environment Variables**
4. **Connect Frontend to Backend**
5. **Go Live**

---

## 🎯 Part 1: Deploy Frontend on Vercel

### Step 1: Open Vercel Dashboard

1. Go to https://vercel.com
2. Click **"New Project"** button
3. You should see a list of your GitHub repositories
4. Find and click on **`maki-web`**

### Step 2: Configure Project

In the Vercel dialog, you'll see:
- **Project Name**: Keep as `maki-web` or change to `maki`
- **Framework**: Should auto-detect as **Next.js** ✅
- **Root Directory**: Click "Edit" and set to `./frontend`

### Step 3: Environment Variables

Click on **"Environment Variables"** section and add:

**Variable Name**: `NEXT_PUBLIC_API_URL`  
**Value**: Leave empty for now (you'll update it after backend deploys)

For example later: `https://maki-backend.railway.app`

### Step 4: Deploy

Click **"Deploy"** button and wait (2-3 minutes)

Once done, you'll see:
- ✅ Production URL: `https://maki-xxxx.vercel.app`
- ✅ All pages deployed
- ✅ Auto-redeploys on git push

**Copy your Vercel URL** - you'll need it soon!

---

## 🎯 Part 2: Deploy Backend on Railway

### Step 1: Open Railway Dashboard

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Connect your GitHub account (if needed)

### Step 2: Select Repository

1. Find your `maki-web` repo
2. Click to import
3. Railway will detect Node.js backend

### Step 3: Configure Backend

Railway will auto-detect:
- **Root**: `/backend`
- **Start Command**: `npm start`
- **Build Command**: `npm run build`

### Step 4: Add Database (PostgreSQL)

1. Click **"+ Add Service"**
2. Select **"PostgreSQL"**
3. Railway creates a database automatically
4. **Copy the DATABASE_URL** from the PostgreSQL service

### Step 5: Set Environment Variables

In Railway, add these environment variables:

```
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-vercel-url.vercel.app
DATABASE_URL=postgresql://... (from Railway PostgreSQL)
JWT_ACCESS_SECRET=your-random-secret-32-chars-min
JWT_REFRESH_SECRET=your-random-secret-32-chars-min
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

**Generate Secrets**:
- Option 1: Use an online UUID generator (e.g., https://uuidonline.com)
- Option 2: Use this in terminal:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### Step 6: Deploy

Click **"Deploy"** and wait (5-10 minutes)

Once done, you'll see:
- ✅ Production Backend URL: `https://maki-backend.railway.app`
- ✅ Database connected
- ✅ All APIs deployed

**Copy your Railway Backend URL** - you'll use this next!

---

## 🔗 Part 3: Connect Frontend to Backend

### Step 1: Update Vercel Environment Variable

1. Go back to your Vercel project
2. Click **"Settings"** tab
3. Click **"Environment Variables"**
4. Find `NEXT_PUBLIC_API_URL`
5. **Update the value** to your Railway backend URL:
   ```
   https://maki-backend.railway.app
   ```
6. Click "Save"

### Step 2: Redeploy Frontend

1. Vercel will automatically redeploy
2. Or manually click "Redeploy" in Deployments tab
3. Wait for build to complete

---

## ✅ Verify Everything Works

### Test Your Live Platform

1. **Open Frontend**: https://your-maki.vercel.app
2. **Test Login**: Use test account
   - Email: `owner1@example.com`
   - Password: `Password123!`
3. **Test Features**:
   - Browse properties
   - Filter by city
   - Send message
   - Switch language
4. **Test API**: 
   - Go to Backend URL + `/health`
   - Should return `{"status":"ok"}`

---

## 🎉 You're Live!

Your MAKI platform is now accessible from anywhere:

```
🌐 Frontend: https://your-maki.vercel.app
🔗 Backend API: https://maki-backend.railway.app/api/v1
📊 Database: Connected (PostgreSQL on Railway)
```

---

## 📱 Share Your Platform

Send this to anyone:

```
Hey! Check out MAKI - a property rental platform!

🔗 https://your-maki.vercel.app

📋 Test Accounts:
- Email: owner1@example.com
- Password: Password123!

(Also try renter1@example.com)

Features:
✅ Create & manage properties
✅ Search by city
✅ Direct messaging
✅ 3 languages
✅ Interactive maps
```

---

## 🚨 Troubleshooting

### "Connection Refused" When Logging In
**Problem**: Frontend can't reach backend
**Solution**: 
1. Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. Verify Railway backend is running (check Railway dashboard)
3. Redeploy frontend

### "Database Connection Failed"
**Problem**: Backend can't connect to database
**Solution**:
1. Check DATABASE_URL in Railway environment variables
2. Verify PostgreSQL service is running
3. Restart backend in Railway

### "Build Failed on Vercel"
**Problem**: Build error during deployment
**Solution**:
1. Check build logs in Vercel dashboard
2. Look for TypeScript or dependency errors
3. Fix locally and push to GitHub
4. Vercel auto-redeploys

---

## 💾 Useful Commands (Local)

Test everything locally before deploying:

```bash
# Backend
cd backend
npm run build      # Build backend
npm start          # Run production build

# Frontend
cd frontend
npm run build      # Build frontend
npm run start      # Run production build
```

---

## 🔐 Security Checklist

- [x] JWT secrets are random 32+ characters
- [x] DATABASE_URL is secure (Railway provides it)
- [x] NEXT_PUBLIC_API_URL points to production backend
- [x] CLIENT_URL in backend points to Vercel frontend
- [x] Environment variables set in both Vercel and Railway
- [x] Database credentials never in code

---

## 📊 Final Architecture

```
Users
  ↓
https://your-maki.vercel.app (Frontend - Vercel)
  ↓
https://maki-backend.railway.app/api/v1 (Backend - Railway)
  ↓
PostgreSQL Database (Railway)
```

---

## ✨ Summary

**Frontend**: Deployed on Vercel ✅  
**Backend**: Deployed on Railway ✅  
**Database**: PostgreSQL on Railway ✅  
**Domain**: Using free Vercel/Railway URLs ✅  
**Status**: LIVE 🚀  

---

## 🎯 Next Steps

1. Follow the steps above
2. Test your live platform
3. Share the URL with friends
4. Get feedback
5. Add custom domain (optional)

---

**MAKI is ready to go live!** 🎉

Questions? Check the Railway and Vercel dashboards for logs.

Good luck! 🍀
