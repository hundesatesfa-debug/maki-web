# 🚀 MAKI Deployment Guide - Access from Anywhere

## Overview

To share MAKI with people outside your network, you need to deploy it to a cloud service. Here are the easiest options:

---

## Option 1: Vercel (Recommended for Frontend) ⭐

### Pros:
- Free tier available
- Instant deployment
- Automatic SSL/HTTPS
- Perfect for Next.js

### Steps:

1. **Push to GitHub**
   ```bash
   cd C:\Users\odaa\Desktop\MAKI\ WEB\frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/maki-frontend.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables
   - Click "Deploy"

3. **Your Frontend URL:**
   ```
   https://maki-frontend.vercel.app
   ```

---

## Option 2: Netlify (Alternative Frontend)

### Steps:

1. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy**
   - Go to https://netlify.com
   - Drag and drop `frontend/.next` folder
   - Get public URL

---

## Option 3: Render (Free Backend + Frontend)

### Deploy Backend:

1. **Push backend to GitHub**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Backend initial"
   git push to your repo
   ```

2. **On Render.com:**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub
   - Build command: `npm install`
   - Start command: `npm run build && npm start`
   - Add environment variables
   - Deploy

3. **Your Backend URL:**
   ```
   https://maki-backend.onrender.com/api/v1
   ```

---

## Option 4: Railway.app (Full Stack - Easy!)

### Best for: Complete deployment

1. **Connect GitHub**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub"

2. **Select Repository**
   - Choose your monorepo

3. **Configure Services**
   - Frontend (Next.js)
   - Backend (Express)
   - Database (PostgreSQL)

4. **Get URLs**
   ```
   Frontend: https://maki.railway.app
   Backend: https://maki-api.railway.app/api/v1
   ```

---

## Option 5: AWS/Azure (Enterprise)

For production-grade deployment:
- AWS Amplify (Frontend)
- AWS EC2/ECS (Backend)
- RDS (Database)

Requires more setup but more control.

---

## Recommended Setup: Vercel + Railway

### Frontend: Vercel
- Fast, free, perfect for Next.js
- Automatic deployments on push

### Backend: Railway
- Node.js friendly
- PostgreSQL included
- Good free tier

---

## Step-by-Step: Vercel + Railway

### 1. Deploy Frontend on Vercel

```bash
# Make sure you're in frontend folder
cd frontend

# Add environment variable
# NEXT_PUBLIC_API_URL=https://maki-api.railway.app

# Push to GitHub
git push

# Go to vercel.com and import
```

### 2. Deploy Backend on Railway

```bash
# In backend folder
cd backend

# Push to GitHub
git push

# On Railway:
# - Add PostgreSQL database
# - Set environment variables
# - Deploy
```

### 3. Update Frontend Config

In `frontend/.env.production`:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

---

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-url.vercel.app

DATABASE_URL=postgresql://...  # From Railway PostgreSQL

JWT_ACCESS_SECRET=your-secret-key-32-chars-min
JWT_REFRESH_SECRET=your-secret-key-32-chars-min
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

---

## Database Migration

When deploying, migrate database:

```bash
# On your local machine or CI/CD
cd backend
npx prisma migrate deploy

# Or push schema
npx prisma db push
```

---

## Custom Domain

After deployment:

1. **Buy Domain**
   - GoDaddy, Namecheap, etc.
   - Cost: ~$10/year

2. **Point to Vercel**
   - Add DNS records
   - Vercel automatically provides SSL

3. **Your URL**
   ```
   https://maki.com
   https://www.maki.com
   ```

---

## Quick Comparison

| Service | Frontend | Backend | Price | Setup |
|---------|----------|---------|-------|-------|
| **Vercel** | ✅ | ❌ | Free | Easy |
| **Netlify** | ✅ | ❌ | Free | Easy |
| **Railway** | ✅ | ✅ | Free | Easy |
| **Render** | ✅ | ✅ | Free | Medium |
| **AWS** | ✅ | ✅ | Pay | Hard |

---

## Sharing After Deployment

Once deployed, share:

```
🌐 https://maki.vercel.app

🔑 Login:
- Email: owner1@example.com
- Password: Password123!
```

---

## Troubleshooting Deployment

### 404 Errors
- Check API_URL environment variable
- Verify backend is running

### CORS Errors
- Update backend CORS settings
- Allow frontend domain

### Database Connection Failed
- Verify DATABASE_URL
- Check firewall settings
- Ensure database is accessible

---

## Production Checklist

- [ ] Environment variables set
- [ ] Database migrated
- [ ] CORS configured
- [ ] SSL/HTTPS working
- [ ] Test login/register
- [ ] Test all features
- [ ] Monitor logs
- [ ] Set up error tracking (Sentry)

---

## Support

For deployment issues:
1. Check service documentation
2. Review logs in dashboard
3. Test locally first
4. Use service support chat

---

## Free Tier Limits

| Service | Limit |
|---------|-------|
| Vercel | 100 deployments/month |
| Railway | $5/month free credit |
| Render | 750 hours/month |

---

## Next: Make it Public

After deployment:

1. Share deployment URL
2. Get feedback
3. Fix issues
4. Add more features
5. Consider paid tier if needed

---

**Status:** Ready for deployment
**Estimated Time:** 15-30 minutes
**Cost:** Free (or $5-10/month for better service)

