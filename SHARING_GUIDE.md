# 🎉 MAKI - Sharing Guide

## Website Live & Ready to Share!

### Access Information

**Frontend URL:**
```
http://192.168.56.1:3000
```

**Backend API:**
```
http://192.168.56.1:5001/api/v1
```

---

## ✨ What's New

### 1. **Brand Rebrand: MAKI**
- Artistic gradient logo with "M" icon
- Modern, professional branding
- Premium property rental platform

### 2. **Multi-Language Support**
The platform now supports:
- 🇬🇧 **English**
- 🇪🇹 **Afan Oromo**
- 🇪🇹 **Amharic**

Language switcher in the header allows instant switching between all three languages.

### 3. **Features Enabled**
✅ User Authentication (Register/Login)
✅ Role-Based Access (Admin, Owner, Renter)
✅ Listing Browse
✅ Profile Management
✅ Multi-Language Interface

---

## 🔑 Test Accounts

Use these credentials to test the platform:

### Admin Account
```
Email: admin@houserentethiopia.com
Password: Password123!
Role: Admin
Redirects to: /dashboard
```

### Owner Account
```
Email: owner1@example.com
Password: Password123!
Role: Owner
Redirects to: /my-listings
```

### Renter Account
```
Email: renter1@example.com
Password: Password123!
Role: Renter
Redirects to: /listings
```

---

## 🚀 How to Share

### For Testing on Local Network

1. **Share the URL with your tester:**
   ```
   http://192.168.56.1:3000
   ```

2. **Make sure:**
   - Both backend and frontend services are running
   - Firewall allows port 3000 and 5001 access
   - Tester is on the same network

### Step-by-Step Testing Guide

1. **Open the website**
   - Go to `http://192.168.56.1:3000`
   - Wait for the page to load

2. **Try Different Languages**
   - Click the language switcher (Globe icon, top right)
   - Select English, Afan Oromo, or Amharic
   - Content updates instantly

3. **Register a New Account**
   - Click "Register" button
   - Choose "I'm a Renter" or "I'm an Owner"
   - Fill in details (remember password requirements!)
   - You'll be redirected based on your role

4. **Login with Test Account**
   - Use the accounts listed above
   - After login, profile appears in header
   - Dropdown menu shows role-specific options

5. **Logout**
   - Click profile → Logout
   - Returns to home page

---

## 📋 Supported Languages

### English
- Complete interface
- Professional terminology
- Full feature labels

### Afan Oromo (ኦሮሞ)
- Navigation menus
- Auth pages
- Listing interface
- Footer content

### Amharic (አማርኛ)
- Navigation menus
- Auth pages
- Listing interface
- Footer content

---

## 🎯 What to Test

### Functionality
- [ ] Language switching works smoothly
- [ ] Login/Register functionality
- [ ] Role-based redirects
- [ ] Profile menu appears when logged in
- [ ] Logout clears auth

### UI/UX
- [ ] MAKI branding is clear and artistic
- [ ] Responsive design on mobile
- [ ] Navigation is intuitive
- [ ] Text translations are accurate

### Translation Accuracy
- Verify translations are grammatically correct
- Check context appropriateness
- Ensure UI elements render properly with longer text

---

## 💡 Developer Notes

### Backend Status
- Express.js API running on port 5001
- SQLite database with sample data
- JWT authentication enabled
- Rate limiting configured (100 requests/15 min for auth)

### Frontend Stack
- Next.js 16 with Turbopack
- TailwindCSS for styling
- Zustand for state management
- React Hook Form for forms
- Multi-language via custom i18n

### Translation Files
Located at:
```
frontend/src/lib/translations.ts
```

To add more languages:
1. Add new language code to `Language` type
2. Add translations object
3. Add to language switcher options

---

## 🔧 Common Issues & Solutions

### Can't Connect?
- Verify services are running: `netstat -ano | findstr :3000` and `:5001`
- Check firewall settings
- Ensure you're on the same network

### Language Not Switching?
- Clear browser cache (Ctrl+Shift+Del)
- Check localStorage in DevTools
- Refresh the page

### Login Not Working?
- Verify password meets requirements (8+ chars, upper, lower, number, special char)
- Check email format
- Ensure backend service is running

---

## 📞 Sharing Checklist

Before sharing with testers:

- [ ] Both frontend and backend are running
- [ ] Access URLs are correct
- [ ] Test accounts are accessible
- [ ] Network connectivity is confirmed
- [ ] Share this guide with tester
- [ ] Ask for feedback on:
  - Language accuracy
  - UI responsiveness
  - Feature functionality
  - Performance

---

## 🌍 Next Steps (Future Development)

- [ ] Payment integration
- [ ] File uploads (Cloudinary)
- [ ] Google Maps integration
- [ ] Messaging system UI
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Search & filtering
- [ ] Favorites system

---

## 📞 Contact & Support

For issues or questions:
1. Check the backend logs
2. Review browser console for errors
3. Verify database connection
4. Check environment variables

---

**Status:** ✅ Ready for Testing & Sharing
**Last Updated:** June 26, 2026
**Version:** 1.0.0 (MAKI Release)

---

### Share Link Template

> **Hey! Check out MAKI - a multi-language property rental platform!**
>
> 🌐 Visit: `http://192.168.56.1:3000`
>
> 🔑 Test as Owner: `owner1@example.com` / `Password123!`
>
> Features:
> - 🌍 3 Languages: English, Afan Oromo, Amharic
> - 🔐 Secure authentication
> - 🏠 Browse properties
> - 👥 Role-based access
>
> Let me know what you think!

