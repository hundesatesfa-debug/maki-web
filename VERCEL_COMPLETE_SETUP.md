# 🚀 MAKI Complete Vercel Deployment Guide

**Your Project Structure:**
```
MAKI WEB/
├── backend/          ← Express API (Deploy on Render)
├── frontend/         ← Next.js App (Deploy on Vercel)
├── package.json      ← Root package.json
├── vercel.json       ← NOT NEEDED (deleted)
└── ...
```

---

## 📋 Step-by-Step Vercel Deployment

### **Step 1: Clear Previous Deployments (Fresh Start)**

1. Go to https://vercel.com/dashboard
2. Find your `maki-web` project
3. Click **"Settings"** → **"Advanced"** → **"Delete Project"**
4. Confirm deletion
5. Start fresh with new deployment

---

### **Step 2: Create New Vercel Project**

1. Go to https://vercel.com
2. Click **"New Project"**
3. Connect GitHub (if needed)
4. Select **`maki-web`** repository
5. Click **"Import"**

---

### **Step 3: Configure Project Settings**

**In the Import Project dialog:**

#### **Project Name**
```
maki-web
```

#### **Framework Preset**
```
Next.js ✅ (Auto-detected)
```

#### **Root Directory** ⚠️ MOST IMPORTANT
```
Change to: ./frontend
```
This tells Vercel to deploy ONLY the frontend folder, not the entire monorepo.

#### **Environment Variables** (Optional for now)
```
NEXT_PUBLIC_API_URL = http://localhost:5001
```
(You'll update this after backend deploys)

---

### **Step 4: Deploy**

1. Click **"Deploy"** button
2. Wait 3-5 minutes for build
3. You should see: ✅ **Deployment Successful**

---

### **Step 5: Get Your Live URL**

After successful deployment, Vercel shows:
```
✅ Production: https://maki-web-XXXX.vercel.app
```

**Copy this URL!** You need it for the backend configuration.

---

## 🔍 If Build Fails

### **Error: "Cannot find module"**
- Vercel might be building from wrong directory
- Make sure Root Directory is set to `./frontend`

### **Error: "next.config not found"**
- Check if `frontend/next.config.ts` exists
- Root Directory must be `./frontend`

### **Error: "Build took too long"**
- Dependencies installing slowly
- Redeploy (Vercel will retry)

---

## ✅ After Frontend is Live

### **What You Now Have:**
- ✅ Frontend URL: `https://maki-web-XXXX.vercel.app`
- ✅ Live Next.js app on CDN
- ✅ Auto-deploys when you push to GitHub

---

## 🔗 Next: Connect to Backend

Once backend is deployed on Render, update Vercel:

1. Go to Vercel project → **Settings**
2. Click **"Environment Variables"**
3. Update `NEXT_PUBLIC_API_URL` to:
   ```
   https://your-backend.onrender.com
   ```
4. Vercel auto-redeploys with new URL

---

## 🎯 Complete Flow

```
1. GitHub Push
   ↓
2. Vercel Auto-Detects Changes
   ↓
3. Vercel Builds Frontend (from ./frontend)
   ↓
4. Deploys to CDN
   ↓
5. Live at: https://maki-web-XXXX.vercel.app
```

---

## 📝 Directory Structure for Vercel

```
MAKI WEB/
├── frontend/                    ← ROOT DIRECTORY SET TO THIS
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (main)/
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   ├── lib/
│   │   └── hooks/
│   ├── next.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
├── backend/                     ← NOT DEPLOYED BY VERCEL (use Render)
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

---

## 🚨 IMPORTANT: Why Root Directory Matters

**Wrong:**
```
Root Directory: /
→ Vercel tries to build entire monorepo
→ Tries to find next.config in root
→ Fails ❌
```

**Correct:**
```
Root Directory: ./frontend
→ Vercel builds ONLY frontend folder
→ Finds next.config.ts correctly
→ Success ✅
```

---

## 🎊 Final Status

After following these steps:

```
✅ Frontend deployed on Vercel
✅ Live URL: https://maki-web-XXXX.vercel.app
✅ Auto-deploys on GitHub push
✅ Ready to connect to backend
```

---

## 📞 Troubleshooting Checklist

- [ ] Root Directory set to `./frontend`
- [ ] Vercel detected Next.js framework
- [ ] No build errors in Vercel logs
- [ ] Can access the deployment URL
- [ ] Frontend loads without API errors (API will be localhost for now)

---

**Ready? Start fresh deployment now!** 🚀

Next: Deploy backend on Render, then connect them!
