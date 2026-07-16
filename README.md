# House Rent Ethiopia - Full Stack Application

A modern real estate rental platform built with Next.js, Express.js, and Prisma ORM.

## 🚀 Project Status

| Component | Status | Details |
|-----------|--------|---------|
| **Backend API** | ✅ Running | Express.js on port 5000 |
| **Frontend Web** | ✅ Running | Next.js on port 3000 |
| **Database** | ⚠️ Offline | Supabase (network access needed) |

**Both services are currently running and ready to accept requests.**

---

## 🎯 Quick Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **API Health**: http://localhost:5000/health

---

## 📋 Complete Documentation

| Document | Purpose |
|----------|---------|
| **QUICK_START.md** | 5-minute setup and common tasks |
| **SETUP_COMPLETE.md** | Comprehensive installation guide |
| **SYSTEM_STATUS.md** | Current system status and configuration |
| **README.md** | This file - overview and architecture |

**Start with QUICK_START.md if you're new to the project.**

---

## 🏗️ Architecture Overview

### Backend Structure
```
Express.js API (TypeScript)
├── Authentication Module
│   ├── User Registration
│   ├── Login/Logout
│   ├── Token Management
│   └── Password Reset
├── Middleware
│   ├── JWT Authentication
│   ├── Request Validation
│   ├── Rate Limiting
│   ├── Error Handling
│   └── Security Headers
└── Database Layer
    └── Prisma ORM (PostgreSQL)
```

### Frontend Structure
```
Next.js Application (React + TypeScript)
├── Authentication Pages
│   ├── Login
│   ├── Register
│   ├── Forgot Password
│   └── Reset Password
├── Protected Routes
├── UI Components
│   ├── Buttons, Cards, Forms
│   ├── Tables, Dialogs
│   └── Layout Components
├── State Management (Zustand)
└── API Client (Axios)
    └── Auto Token Injection
```

### Database Schema
```
PostgreSQL (Supabase)
├── Users
│   ├── Registration/Login data
│   ├── JWT tokens
│   └── Profile information
├── Listings
│   ├── House/Apartment data
│   ├── Images
│   ├── Pricing
│   └── Location/Coordinates
├── Favorites
├── Conversations
│   ├── Messages
│   └── Participants
├── Notifications
└── Premium Listings
```

---

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT with bcrypt hashing
- **Validation**: Zod
- **File Uploads**: Cloudinary integration
- **Email**: Nodemailer
- **Real-time**: Socket.io ready
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: Next.js 16 with Turbopack
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Components**: shadcn/ui
- **Package Manager**: npm

---

## 📦 Available API Endpoints

All requests use `Content-Type: application/json`

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890"
}
```

#### Login User
```http
POST /api/v1/auth/login

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
(Requires refreshToken cookie)
```

#### Logout User
```http
POST /api/v1/auth/logout
Authorization: Bearer <accessToken>
```

#### Forgot Password
```http
POST /api/v1/auth/forgot-password

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/v1/auth/reset-password

{
  "token": "reset_token_from_email",
  "password": "NewPassword123"
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Internet access (initially)

### Run Services

Both services are already running. To verify:

```bash
# Terminal 1 - Check Backend
curl http://localhost:5000/health

# Terminal 2 - Check Frontend
curl http://localhost:3000
```

### Environment Setup

**Backend (.env)** - Already configured
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
```

**Frontend (.env.local)** - Already configured
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 🗄️ Database Connection

### Current Status
The database is **offline** due to network firewall restrictions. Choose one solution:

### Solution 1: Switch Networks (Fastest)
```bash
# Connect to mobile hotspot or home WiFi
# Supabase will be immediately accessible
npx prisma db push
```

### Solution 2: Use VPN
```bash
# Connect to personal VPN
# Then run migrations
npx prisma db push
```

### Solution 3: Local PostgreSQL
```bash
# Install PostgreSQL locally
# Update DATABASE_URL to: postgresql://localhost:5432/house_rent_ethiopia
# Then run
npx prisma db push
```

### Once Connected
```bash
# Sync database schema
npx prisma db push

# View in Prisma Studio
npm run prisma:studio

# Seed sample data
npm run prisma:seed
```

---

## 📝 Development Workflow

### Add a Backend Endpoint

1. Create route file: `src/modules/[feature]/[feature].routes.ts`
2. Create controller: `src/modules/[feature]/[feature].controller.ts`
3. Create service: `src/modules/[feature]/[feature].service.ts`
4. Create validation: `src/modules/[feature]/[feature].validation.ts`
5. Register in `src/app.ts`:
   ```typescript
   app.use('/api/v1/[feature]', featureRoutes);
   ```
6. Server auto-reloads via nodemon

### Add a Frontend Page

1. Create: `src/app/[page]/page.tsx`
2. Import components from `src/components/`
3. Use Axios client:
   ```typescript
   import api from '@/lib/axios';
   const response = await api.post('/auth/login', data);
   ```
4. Next.js auto-creates the route

### API Communication
- All requests go through `src/lib/axios.ts`
- Auth tokens automatically injected from localStorage
- 401 responses trigger token refresh
- Errors handled via interceptors

---

## 🧪 Testing

### Test Backend Manually
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### Test Frontend
1. Open http://localhost:3000
2. Try the login/register pages
3. Check browser console for API responses

---

## 🔒 Security Features Implemented

✅ **Password Security**
- Bcrypt hashing with salt rounds
- Secure password validation
- Password reset with token expiry

✅ **API Security**
- JWT token authentication
- CORS configuration
- Helmet security headers
- Rate limiting on auth endpoints
- Input validation with Zod

✅ **Database Security**
- Prisma ORM prevents SQL injection
- Enum types for role/status values
- Foreign key constraints
- Cascade delete policies

✅ **Session Management**
- Access tokens (15 min expiry)
- Refresh tokens (7 day expiry)
- Secure HTTP-only cookies
- Token refresh mechanism

---

## 📂 Key Files Reference

| File | Purpose |
|------|---------|
| `backend/src/app.ts` | Express setup and middleware |
| `backend/src/server.ts` | Server entry point |
| `backend/src/config/env.ts` | Environment validation |
| `backend/src/utils/jwt.ts` | JWT token management |
| `backend/prisma/schema.prisma` | Database schema definition |
| `frontend/src/lib/axios.ts` | API client with interceptors |
| `frontend/src/hooks/useAuth.ts` | Authentication hook |
| `frontend/src/store/` | Zustand stores |
| `frontend/.env.local` | Frontend configuration |
| `kiro.json` | Experimental services config |

---

## 🐛 Troubleshooting

### Backend won't start
- Check port 5000 isn't in use: `netstat -ano \| findstr :5000`
- Install dependencies: `npm install`
- Check logs for errors

### Frontend won't load
- Check port 3000 isn't in use
- Clear browser cache
- Check `.env.local` configuration

### API calls return 404
- Verify backend running on port 5000
- Check route path includes `/api/v1`
- Verify CORS is enabled

### Authentication fails
- JWT secrets must be 32+ characters
- Check tokens in browser DevTools
- Verify Authorization header format: `Bearer <token>`

### Database connection fails
- **This is expected** - Network firewall
- Choose one of the solutions in "Database Connection" section
- Once fixed, run `npx prisma db push`

---

## 📚 Additional Resources

### Configuration
- TypeScript: `tsconfig.json`
- Next.js: `next.config.ts`
- TailwindCSS: `tailwind.config.ts`
- ESLint: `eslint.config.mjs`

### Dependencies
- Backend: See `backend/package.json`
- Frontend: See `frontend/package.json`

### Documentation
- Prisma: https://www.prisma.io/docs/
- Next.js: https://nextjs.org/docs
- Express: https://expressjs.com/
- JWT: https://jwt.io/

---

## 🚢 Deployment

### Before Deploying
1. ✅ Connect to database
2. ✅ Run `npx prisma db push`
3. ✅ Test all endpoints
4. ✅ Update environment variables for production
5. ✅ Build both projects:
   ```bash
   npm run build
   npm run start
   ```

### Production Checklist
- [ ] Database is connected and tested
- [ ] All environment variables set
- [ ] JWT secrets are strong and secret
- [ ] Cloudinary credentials configured
- [ ] Email service configured
- [ ] Google Maps API key (if using)
- [ ] CORS allowed origins updated
- [ ] Build passes without errors
- [ ] All tests pass
- [ ] Security headers configured

---

## 📞 Support

### Check Status
- **Backend**: http://localhost:5000/health
- **Frontend**: http://localhost:3000

### View Logs
```bash
# Backend logs (Terminal 1)
npm run dev

# Frontend logs (Terminal 2)
npm run dev
```

### Common Issues
1. **Port in use** - Kill other processes or change port
2. **Module not found** - Run `npm install`
3. **Compilation error** - Check TypeScript errors
4. **API 404** - Verify endpoint path and backend running

---

## 📄 License

This project is part of the House Rent Ethiopia initiative.

---

## 🎉 Ready to Build!

Both services are running and configured. Choose your next step:

1. **Add a feature** - See QUICK_START.md
2. **Connect database** - See database section above
3. **View full setup** - See SETUP_COMPLETE.md
4. **Check system status** - See SYSTEM_STATUS.md

**Happy coding! 🚀**
