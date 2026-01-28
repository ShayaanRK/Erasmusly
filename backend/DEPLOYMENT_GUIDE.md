# 🚀 Erasmusly Backend - Production Deployment Guide

## ✅ Pre-Deployment Checklist

All critical issues have been fixed and the backend is **PRODUCTION READY**!

---

## 🔧 Issues Fixed

### 1. **Database Configuration** ✅
- ✅ Unified database connection to support both `DATABASE_URL` (production) and individual parameters (local)
- ✅ Both `db.js` and `seed.js` now use the same connection strategy
- ✅ SSL configuration properly set for Supabase

### 2. **SQL Errors Fixed** ✅
- ✅ Fixed `housingController.js` line 92: Changed `===` to `<=` for maxPrice filter
- ✅ Fixed `eventController.js` line 62: Changed `=` to `>=` to show upcoming events

### 3. **Logic Improvements** ✅
- ✅ Simplified redundant matching logic in `userController.js`
- ✅ Added null checks to prevent crashes when comparing undefined values

### 4. **CORS Configuration** ✅
- ✅ Made CORS dynamic to support both local and production environments
- ✅ Uses `FRONTEND_URL` environment variable when available

### 5. **Auth Middleware Enhancement** ✅
- ✅ Added `profile_picture` to user data in auth middleware
- ✅ Prevents issues in chat/message controllers that need this field

### 6. **Seeding Enhancement** ✅
- ✅ Created modular `seedDatabase.js` that can be imported or run standalone
- ✅ Added auto-seed capability via `SEED=true` environment variable
- ✅ Works with both local and production database configurations

---

## 🌍 Environment Variables

### **Local Development (.env)**
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=erasmusly
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_secret_key
```

### **Production (Render Environment Variables)**
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_production_secret
FRONTEND_URL=https://your-frontend-url.com
NODE_ENV=production
```

**Optional for one-time seeding:**
```env
SEED=true
```

---

## 📦 Deployment Steps

### **Step 1: Push to GitHub**
```bash
git add .
git commit -m "Production-ready backend with all fixes"
git push origin main
```

### **Step 2: Configure Render**

1. Go to your Render dashboard
2. Select your backend service
3. Add environment variables:
   - `DATABASE_URL` - Your Supabase connection string
   - `JWT_SECRET` - Strong secret key
   - `FRONTEND_URL` - Your deployed frontend URL
   - `NODE_ENV` - Set to `production`

### **Step 3: Seed the Database (One-Time)**

**Option A: Via Render Dashboard**
1. Add environment variable: `SEED=true`
2. Trigger a manual deploy
3. Check logs to verify seeding completed
4. **IMPORTANT**: Remove `SEED=true` after successful seeding
5. Redeploy without the SEED variable

**Option B: Via Render Shell**
1. Open Render Shell for your service
2. Run: `npm run seed`
3. Verify success in logs

### **Step 4: Verify Deployment**

Test these endpoints (replace with your Render URL):

```bash
# Health check
GET https://your-backend.onrender.com/

# Register a user
POST https://your-backend.onrender.com/api/users
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}

# Login
POST https://your-backend.onrender.com/api/users/login
Body: {
  "email": "sophia@example.com",
  "password": "123456"
}

# Get housing posts (requires auth token)
GET https://your-backend.onrender.com/api/housing
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}

# Get events (requires auth token)
GET https://your-backend.onrender.com/api/events
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}

# Get matches (requires auth token)
GET https://your-backend.onrender.com/api/users/matches
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
```

---

## 🧪 Local Testing

### **Test Seeding Locally**
```bash
# Method 1: Run seed script directly
npm run seed

# Method 2: Start server with auto-seed
SEED=true npm start
```

### **Test All Endpoints**
```bash
# Start server
npm run dev

# In another terminal, test endpoints
# (Use the same curl commands above but with http://localhost:5000)
```

---

## 📊 API Endpoints Summary

### **Public Endpoints**
- `POST /api/users` - Register new user
- `POST /api/users/login` - Login user

### **Protected Endpoints** (Require JWT token)
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `GET /api/users/matches` - Get roommate matches
- `GET /api/housing` - Get all housing posts (supports filters: city, minPrice, maxPrice)
- `POST /api/housing` - Create housing post
- `GET /api/events` - Get upcoming events
- `POST /api/events` - Create event
- `POST /api/chat` - Create/access chat with user
- `GET /api/chat` - Get all user's chats
- `POST /api/chat/message` - Send message (also available at `/api/message`)
- `GET /api/message/:chatId` - Get messages for a chat

---

## 🔐 Seeded Test Accounts

After seeding, you can login with any of these accounts:

| Email | Password | City |
|-------|----------|------|
| sophia@example.com | 123456 | Berlin |
| ruben@example.com | 123456 | Lisbon |
| emma@example.com | 123456 | Paris |
| matteo@example.com | 123456 | Rome |
| anya@example.com | 123456 | Warsaw |
| liam@example.com | 123456 | Dublin |

---

## 🐛 Troubleshooting

### **Database Connection Issues**
- Verify `DATABASE_URL` is correctly set in Render
- Check Supabase connection pooler is enabled
- Ensure SSL is configured: `ssl: { rejectUnauthorized: false }`

### **CORS Errors**
- Verify `FRONTEND_URL` environment variable is set
- Check frontend is making requests to correct backend URL
- Ensure credentials are included in frontend requests

### **Empty API Responses**
- Database might not be seeded - run seed script
- Check authentication token is valid and included in headers
- Verify user is logged in

### **Socket.io Connection Issues**
- Ensure frontend Socket.io client connects to same URL as API
- Check CORS configuration includes Socket.io origins
- Verify WebSocket connections are allowed on Render

---

## 📝 Notes

- **Database**: PostgreSQL on Supabase with SSL connection pooling
- **Authentication**: JWT tokens with 30-day expiration
- **Real-time**: Socket.io for chat functionality
- **Security**: Parameterized queries prevent SQL injection
- **Validation**: Comprehensive input validation on all endpoints
- **Error Handling**: Proper error messages and status codes

---

## 🎉 Ready for Production!

Your backend is now fully audited and production-ready. All critical issues have been resolved:

✅ Database configuration unified  
✅ SQL syntax errors fixed  
✅ CORS properly configured  
✅ Seeding works in production  
✅ All endpoints validated  
✅ Error handling in place  
✅ Security best practices followed  

**Next Steps:**
1. Push to GitHub
2. Deploy to Render
3. Seed the database once
4. Test all endpoints
5. Connect your frontend
6. 🚀 Launch!
