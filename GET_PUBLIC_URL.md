# 🌐 How to Get Your Public URL for MAKI

**Share MAKI with anyone in the world using NGrok!**

---

## 🚀 Getting Your Public URL

### Option 1: Check NGrok Terminal Output (Easiest)

1. Look at the terminal where NGrok is running
2. Look for a line that says:
   ```
   Forwarding https://xxxx-xxxx-xxxx.ngrok-free.dev -> http://localhost:3000
   ```
3. Your public URL is: `https://xxxx-xxxx-xxxx.ngrok-free.dev`

### Option 2: Check NGrok Dashboard

1. Open http://localhost:4040
2. Click "Endpoints" tab
3. Copy the URL from "Public URL" column

### Option 3: Use Curl (if terminal)

```bash
curl -s http://localhost:4040/api/tunnels | jq '.tunnels[0].public_url'
```

---

## 📱 How to Share

Once you have your public URL:

```
✅ Copy the URL: https://xxxx-xxxx-xxxx.ngrok-free.dev
✅ Share via WhatsApp, Email, Slack, etc.
✅ Anyone can access it from anywhere
✅ Works on desktop and mobile
✅ No network restrictions
```

---

## ✅ Test Your Public URL

1. Open your public URL in a browser
2. You should see MAKI homepage
3. Try all features:
   - Register/login
   - Browse properties
   - Create a listing
   - Send a message
4. Share with friend and test together

---

## 🔗 Public URL Format

```
https://[random-words].ngrok-free.dev

Examples:
- https://happily-suitable-jellyfish.ngrok-free.dev
- https://equally-proper-finch.ngrok-free.dev
- https://openly-calm-badger.ngrok-free.dev

⚠️ NOTE: Your URL changes every time NGrok restarts
```

---

## ⏰ How Long Does it Last?

```
✅ NGrok free tier: URL valid for 2 hours
✅ After 2 hours: Generate new URL automatically
✅ Share new URL with users
✅ Or upgrade NGrok for permanent URL
```

---

## 🎯 Sharing Instructions for Testers

**Send them this:**

```
Hey! Check out MAKI - a property rental platform I built!

🔗 URL: https://[your-url].ngrok-free.dev

📋 TEST ACCOUNTS (use any):

Owner (Create properties):
  Email: owner1@example.com
  Password: Password123!

Renter (Browse properties):
  Email: renter1@example.com
  Password: Password123!

Admin (Full access):
  Email: admin@houserentethiopia.com
  Password: Password123!

✨ Features to try:
  1. Create a property listing (as owner)
  2. Browse properties by city (as renter)
  3. Send a message to property owner
  4. Switch languages (English, Oromo, Amharic)
  5. View properties on map

Let me know what you think! 🚀
```

---

## 🐛 Troubleshooting

### "URL doesn't work"
```
✅ Make sure frontend is running: npm run dev (port 3000)
✅ Make sure NGrok is running
✅ Check NGrok is forwarding to localhost:3000
✅ Try the URL again (sometimes takes 10 seconds)
```

### "Connection refused"
```
✅ Frontend crashed - restart it: npm run dev
✅ ngrok crashed - restart it
✅ Port 3000 in use - check Task Manager
```

### "URL changed"
```
✅ NGrok restarts every 2 hours (free tier)
✅ Get new URL from: http://localhost:4040
✅ Share new URL with testers
✅ They'll need to use the new one
```

### "Mobile can't connect"
```
✅ Both on WiFi? Make sure you share HTTPS URL
✅ Use the full URL: https://xxxx-xxxx-xxxx.ngrok-free.dev
✅ Not just: xxxx-xxxx-xxxx
✅ Include the: https://
```

---

## 📊 Current Status

| Service | Port | Status | Public URL |
|---------|------|--------|-----------|
| Frontend | 3000 | ✅ Running | Available via NGrok |
| Backend | 5001 | ✅ Running | Internal only |
| NGrok | - | ✅ Active | Check terminal |

---

## 🔄 Getting New URL

If your NGrok URL expired or stopped working:

### Restart NGrok:
```bash
# Stop current NGrok (Ctrl+C)
# Then run:
ngrok http 3000
```

### Get the new URL:
```
Look for line: Forwarding https://xxxx-xxxx.ngrok-free.dev
Share this new URL with your testers
```

---

## 💾 Save Your URL

### Copy Public URL
```
1. Right-click on URL
2. Copy link
3. Paste in browser to test
4. Share via message/email
```

### Check Every 2 Hours
```
Because free ngrok expires:
- Check terminal for current URL
- Share new one if it changed
- Users will need to use the new one
```

---

## 🎯 Launch Checklist

- [ ] NGrok running and showing URL
- [ ] Public URL copied
- [ ] Tested public URL works
- [ ] Frontend loads on public URL
- [ ] Can login on public URL
- [ ] Can create listing on public URL
- [ ] Can search properties on public URL
- [ ] Shared URL with first tester
- [ ] Got feedback

---

## 📱 Mobile Testing

To test on your phone:

1. Make sure phone on same WiFi (or just use public URL)
2. Open your mobile browser
3. Go to: `https://[your-url].ngrok-free.dev`
4. Test all features
5. Check responsiveness

---

## 🌍 Geographic Testing

**Your URL works globally!**

✅ Share with friend in different country  
✅ Friend in different city  
✅ Anyone with internet  
✅ No firewall needed  
✅ No VPN needed  

---

## 💡 Pro Tips

### Tip 1: Save URL to Notes
```
Copy your URL to a sticky note or document
In case you need it later
```

### Tip 2: Bookmark Public URL
```
Save https://xxxx.ngrok-free.dev as bookmark
Quick access for testing
```

### Tip 3: Schedule Testing
```
Tell testers to test between certain hours
Because URL changes every 2 hours (free tier)
Or use same URL within 2-hour window
```

### Tip 4: Upgrade NGrok for Production
```
Free tier: URL changes every 2 hours
Paid tier: Permanent custom domain
For production: Use Vercel/Railway instead
```

---

## 🔐 Security Note

Your NGrok URL is publicly accessible but:

✅ Only accessible to people you share it with  
✅ HTTPS encryption enabled  
✅ Database not exposed  
✅ Your computer password not exposed  
✅ Safe for testing with friends  

⚠️ For production: Deploy to Vercel/Railway instead

---

## 🚀 Ready to Share?

1. Get your public URL
2. Copy it
3. Send to friends
4. Get feedback
5. Fix any issues
6. Keep iterating

**Let's launch MAKI! 🎉**

---

**Questions?** Check:
- `LAUNCH_QUICK_START.md` - How to test
- `FINAL_STATUS_REPORT.md` - Project status
- `DEPLOYMENT_GUIDE.md` - Deploy to production

Good luck! 🍀
