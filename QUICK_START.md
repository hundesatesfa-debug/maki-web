# Quick Start Guide - House Rent Ethiopia

## Running the Project

Both services are already running in development mode:

### Backend
- **Running on**: http://localhost:5000
- **API Base**: http://localhost:5000/api/v1
- **Health Check**: http://localhost:5000/health

### Frontend  
- **Running on**: http://localhost:3000
- **Browser**: Open http://localhost:3000

## What's Configured

✅ **Frontend**
- Next.js 15 with Turbopack
- TailwindCSS for styling
- Zustand for state management
- Axios with automatic auth token injection
- Protected routes component

✅ **Backend**
- Express.js API
- Prisma ORM ready
- JWT authentication
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Error handling middleware

## API Endpoints

All auth endpoints require `Content-Type: application/json`

### Register
```bash
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890"
}
```

### Login
```bash
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "RENTER"
    },
    "accessToken": "jwt-token-here"
  }
}
```

## Development Workflow

### Add a New Backend Endpoint

1. **Create a new module** in `backend/src/modules/[feature]/`
2. **Create files**:
   - `[feature].routes.ts` - Define routes
   - `[feature].controller.ts` - Handle requests
   - `[feature].service.ts` - Business logic
   - `[feature].validation.ts` - Input validation

3. **Register routes** in `backend/src/app.ts`:
```typescript
import featureRoutes from './modules/[feature]/[feature].routes';
app.use('/api/v1/[feature]', featureRoutes);
```

4. **Server auto-reloads** via nodemon

### Add a New Frontend Page

1. **Create file** in `frontend/src/app/[page]/page.tsx`
2. **Next.js auto-creates route**
3. **Import components** from `src/components/`
4. **Use Axios** for API calls:
```typescript
import api from '@/lib/axios';

const data = await api.post('/auth/login', { email, password });
```

## Important Files

| File | Purpose |
|------|---------|
| `backend/.env` | Backend environment variables |
| `frontend/.env.local` | Frontend environment variables |
| `backend/prisma/schema.prisma` | Database schema |
| `backend/src/app.ts` | Main Express app setup |
| `frontend/src/lib/axios.ts` | API client configuration |
| `kiro.json` | Services configuration |

## Database Status

**⚠️ Currently**: Offline (network firewall)  
**Need to**: 
1. Switch to personal network, OR
2. Use VPN, OR
3. Ask IT to whitelist Supabase, OR
4. Install local PostgreSQL

**Once connected**:
```bash
npx prisma db push
```

## Debugging

### Check Backend Logs
```bash
# Terminal 1: Backend logs
npm run dev
```

### Check Frontend Logs
```bash
# Terminal 2: Frontend logs
npm run dev
```

### Test API
```bash
# Health check
curl http://localhost:5000/health

# With auth token
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/v1/auth/logout
```

## Common Issues

### "Port 5000 already in use"
```bash
# Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Port 3000 already in use"
```bash
# Same as above but for port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### API calls returning 404
- Check backend is running
- Verify correct URL format: `/api/v1/...`
- Check CORS is enabled (should be by default)

### Auth token not being sent
- Check localStorage has `accessToken` key
- Verify Axios interceptor in `frontend/src/lib/axios.ts`
- Check browser DevTools Network tab

## Next: Add Database Connection

Once you have database access:

```bash
cd backend

# Test connection
npx prisma db push

# View database
npm run prisma:studio

# Seed sample data (if configured)
npm run prisma:seed
```

## Need Help?

1. **Check logs** - Both terminals show real-time output
2. **Read SETUP_COMPLETE.md** - Comprehensive setup documentation
3. **Check error messages** - Usually very descriptive
4. **Test endpoints** - Use curl or Postman to test API

---

**Status**: ✅ Frontend and Backend Running  
**Database**: ⚠️ Offline (needs network access to Supabase)
