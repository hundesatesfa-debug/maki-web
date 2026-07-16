# 🚀 DEPLOY MAKI TO VERCEL NOW - Quick Start

**You're at the Vercel "New Project" screen. Here's exactly what to do:**

---

## 🎯 What You See in Vercel

```
You are using an unsupported command-line flag --unsafely-treat-insecure-origin-as-secure

✓ Backend
  /api/backend
  
⚠️ vercel.json required to deploy projects with multiple services
```

---

## ✅ Fix 1: Configure Root Directory

1. **In the Vercel dialog**, look for **"Root Directory"** field
2. Click **"Edit"**
3. Change from: `/` 
4. Change to: `./frontend`
5. Click **"Save"**

---

## ✅ Fix 2: Environment Variables

1. Click **"Environment Variables"** (if visible)
2. Or scroll down to "Environment Variables" section
3. Add this variable:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5001` |

(You'll update this after backend deploys)

---

## ✅ Fix 3: Ready to Deploy

At the bottom, you should see:

```
[ Deploy ] button
```

**Click "Deploy"** and wait 2-3 minutes ✅

---

## 🎉 After Frontend Deploys

You'll see:
```
✅ Congratulations! Your project has been successfully deployed.
   
   https://maki-xxxx.vercel.app
```

**Copy this URL!** You'll need it.

---

## 📋 After: Deploy Backend on Railway

Once frontend is done:

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Select **`maki-web`** repo
5. Railway will auto-detect backend
6. Add PostgreSQL database (click "+ Add Service")
7. Set environment variables (see VERCEL_DEPLOYMENT_STEPS.md)
8. Deploy

Copy your Railway URL: `https://maki-api.railway.app`

---

## 📱 Final Step: Connect Frontend to Backend

1. Go back to Vercel project
2. Click **"Settings"**
3. Click **"Environment Variables"**
4. Update `NEXT_PUBLIC_API_URL` to your Railway URL:
   ```
   https://maki-api.railway.app
   ```
5. Redeploy frontend (Vercel does this automatically)

---

## ✨ You're Live!

```
Frontend: https://your-maki.vercel.app
Backend: https://your-backend.railway.app
```

**Share it with the world!** 🎉

---

## 📞 If You Get Stuck

**"vercel.json required" error?**
- ✅ Already created! Just proceed with deployment

**"Root Directory" issue?**
- Set it to `./frontend`

**Can't find Environment Variables?**
- Scroll down in the deployment dialog
- Or set them after deployment in Settings

---

## 🔑 Test Accounts

After deploying, use:
```
Email: owner1@example.com
Password: Password123!
```

---

**Ready? Click Deploy! 🚀**
