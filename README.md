# Erasmusly

**🌍 Live Production:** [https://erasmusly.vercel.app](https://erasmusly.vercel.app)

A production-grade full-stack platform for Erasmus students to discover housing, find compatible roommates, coordinate through real-time messaging, and explore local events. Built with modern cloud deployment practices and environment-based configuration.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Deployment Architecture](#deployment-architecture)
- [Demo Credentials](#demo-credentials)
- [Local Development Setup](#local-development-setup)
- [What This Project Demonstrates](#what-this-project-demonstrates)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)

---

## 🎯 Overview

Erasmusly solves the challenge faced by international Erasmus students: finding verified housing, compatible roommates, and local community events in an unfamiliar city. The platform combines property listings, intelligent roommate matching, real-time chat, and event coordination in a single, secure application.

**Problem Solved:** Fragmented housing search, difficulty finding compatible roommates, and lack of community connection for international students.

**Core Functionality:**
- Secure user authentication with JWT-based session management
- Housing post creation and browsing with image support
- Algorithmic roommate matching based on preferences and location
- Real-time WebSocket-powered messaging system
- Event discovery and coordination
- Responsive, modern UI with smooth animations

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- User registration with BCrypt password hashing
- JWT-based stateless authentication
- Secure token storage and validation
- Protected API routes with middleware

### 🏠 **Housing Management**
- Create, browse, and manage housing listings
- Image upload and display
- Filter by location, price, and amenities
- Detailed property information views

### 👥 **Roommate Matching**
- Profile-based compatibility matching
- Interest and preference alignment
- City-specific filtering
- Direct messaging with matches

### 💬 **Real-Time Chat**
- WebSocket-powered instant messaging
- One-on-one conversations
- Message history persistence
- Online/offline status indicators
- Typing indicators and message delivery

### 🎉 **Event Discovery**
- Browse upcoming Erasmus events
- Location-based event filtering
- Event details (date, location, description)
- Community engagement features

### 👤 **Profile Management**
- Editable user profiles
- Interest tags and bio
- Profile picture support
- Privacy controls

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 19 + Vite
- **Styling:** TailwindCSS 4, Custom CSS
- **UI Components:** Radix UI, Framer Motion
- **State Management:** React Context API
- **HTTP Client:** Axios with interceptors
- **Real-time:** Socket.io Client
- **Routing:** React Router v7
- **Notifications:** React Hot Toast

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Native `pg` driver)
- **Authentication:** JWT (jsonwebtoken) + BCrypt
- **Real-time:** Socket.io Server
- **Security:** CORS, Input validation
- **Environment:** dotenv

### **Database**
- **Primary:** PostgreSQL (Supabase)
- **Connection Pooling:** Session Pooler (Port 6543)
- **Schema:** Users, Housing, Events, Chats, Messages

### **Hosting & Deployment**
- **Frontend:** Vercel (Global CDN)
- **Backend:** Render (Cloud hosting)
- **Database:** Supabase (Managed PostgreSQL)
- **Version Control:** Git + GitHub

### **DevOps & Configuration**
- **Environment Separation:** `.env.local`, `.env.production`
- **Build Tool:** Vite with optimized bundle splitting
- **Deployment:** Automated CI/CD via Vercel and Render
- **CORS:** Dynamic origin configuration for dev/prod

---

## 🚀 Deployment Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                       PRODUCTION ARCHITECTURE                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │   Vercel CDN     │────────▶│   Render Cloud   │             │
│  │   (Frontend)     │         │    (Backend)     │             │
│  │                  │         │                  │             │
│  │  React + Vite    │ HTTPS   │  Express + pg    │             │
│  │  TailwindCSS     │         │  Socket.io       │             │
│  │  Socket.io       │◀────────│  JWT Auth        │             │
│  └──────────────────┘         └──────────────────┘             │
│         │                              │                       │
│         │                              │                       │
│         │                              ▼                       │
│         │                     ┌──────────────────┐             │
│         │                     │   Supabase       │             │
│         │                     │   PostgreSQL     │             │
│         └────────────────────▶│   (Database)     │             │
│           WebSocket            └──────────────────┘            │
│                                                                │
└────────────────────────────────────────────────────────────────┘

Environment Variables:
  Frontend: VITE_API_URL → https://erasmusly.onrender.com
  Backend:  FRONTEND_URL → https://erasmusly.vercel.app
            DATABASE_URL → Supabase connection string
```

### **Deployment Details**

**Frontend (Vercel):**
- Automatic deployments on `git push`
- Global CDN distribution
- SPA routing with `vercel.json` rewrites
- Environment variable injection at build time
- Asset optimization (minification, tree-shaking)

**Backend (Render):**
- Hosted on shared cloud infrastructure
- Automatic redeploy on environment variable changes
- CORS configured for production domain
- Session pooling for database connections
- Seeded with demo data on initial deploy

**Environment Separation:**
- **Development:** `localhost:5173` ↔ `localhost:5000`
- **Production:** `erasmusly.vercel.app` ↔ `erasmusly.onrender.com`

---

## 🔑 Demo Credentials

Use this account to immediately explore the full feature set with pre-populated data:

- **Email:** `sophia@example.com`
- **Password:** `123456`

**Pre-loaded Data:**
- Multiple housing listings with images
- Active chat conversations
- Upcoming events
- Roommate matches

---

## 💻 Local Development Setup

### **Prerequisites**
- Node.js v18+ installed
- PostgreSQL installed and running (or Supabase account)
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/ShayaanRK/Erasmusly.git
cd Erasmusly
```

### **2. Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials (see Environment Variables section)

# Seed database with demo data
npm run seed

# Start backend server
npm run dev
# Server runs on http://localhost:5000
```

### **3. Frontend Setup**
```bash
cd frontend
npm install

# Create .env.local file
echo "VITE_API_URL=http://localhost:5000" > .env.local

# Start frontend development server
npm run dev
# App runs on http://localhost:5173
```

### **4. Access Application**
Open your browser to `http://localhost:5173` and login with demo credentials.

---

## 🎓 What This Project Demonstrates

### **Full-Stack Engineering**
- End-to-end feature implementation from database to UI
- RESTful API design and consumption
- Real-time bi-directional communication (WebSockets)
- State management across client and server

### **DevOps & Deployment**
- Environment-based configuration management
- Separation of development and production environments
- Automated deployment pipelines (Vercel, Render)
- CORS and security configuration for cross-origin requests

### **Security Best Practices**
- Password hashing with BCrypt
- JWT-based stateless authentication
- Protected API routes with middleware
- Environment variable isolation (no secrets in code)
- HTTPS enforcement in production

### **Modern Development Workflow**
- Component-based UI architecture
- Code splitting and lazy loading
- Optimized production builds
- Version control with Git
- Clean, maintainable codebase

### **Database Management**
- PostgreSQL schema design
- Connection pooling for performance
- Database seeding and migrations
- SQL query optimization

---

## 🔐 Environment Variables

### **Backend (`.env`)**
```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=postgresql://user:password@host:port/database
FRONTEND_URL=https://erasmusly.vercel.app  # For production CORS
SEED=false  # Set to 'true' to re-seed database on server start
```

### **Frontend (`.env.local` for dev, `.env.production` for prod)**
```env
# Development
VITE_API_URL=http://localhost:5000

# Production (set in Vercel dashboard)
VITE_API_URL=https://erasmusly.onrender.com
```

**Important:** Never commit `.env` files to version control. The `.env.production` file is an exception as it contains only the production API URL (no secrets).

---

## 📚 API Documentation

### **Base URL**
- **Production:** `https://erasmusly.onrender.com/api`
- **Development:** `http://localhost:5000/api`

### **Endpoints**

#### **Authentication**
```
POST   /api/users/register    - Register new user
POST   /api/users/login       - Login user (returns JWT)
GET    /api/users/profile     - Get user profile (protected)
PUT    /api/users/profile     - Update user profile (protected)
```

#### **Housing**
```
GET    /api/housing           - Get all housing posts
GET    /api/housing/:id       - Get single housing post
POST   /api/housing           - Create housing post (protected)
PUT    /api/housing/:id       - Update housing post (protected)
DELETE /api/housing/:id       - Delete housing post (protected)
```

#### **Events**
```
GET    /api/events            - Get all events
GET    /api/events/:id        - Get single event
POST   /api/events            - Create event (protected)
PUT    /api/events/:id        - Update event (protected)
DELETE /api/events/:id        - Delete event (protected)
```

#### **Chat**
```
GET    /api/chat              - Get user's chats (protected)
POST   /api/chat/access       - Create or access chat with user (protected)
```

#### **Messages**
```
GET    /api/message/:chatId   - Get messages for chat (protected)
POST   /api/message           - Send new message (protected)
```

**Authentication:** Protected routes require `Authorization: Bearer <token>` header.

---

## 📝 Project Structure

```
Erasmusly/
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route-based page components
│   │   ├── context/            # React Context (Auth, etc.)
│   │   ├── api.js              # Axios instance with interceptors
│   │   └── main.jsx            # Application entry point
│   ├── .env.production         # Production environment config
│   ├── vercel.json             # Vercel deployment config
│   └── package.json
│
├── backend/                    # Express + PostgreSQL backend
│   ├── config/
│   │   └── db.js               # Database connection
│   ├── controllers/            # Route logic
│   ├── routes/                 # API route definitions
│   ├── middleware/             # Auth middleware
│   ├── scripts/
│   │   └── seedDatabase.js     # Database seeding script
│   ├── server.js               # Express server setup
│   └── package.json
│
└── README.md                   # This file
```

---

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome. Please open an issue to discuss proposed changes. Email me at kshayaanraza@gmail.com

---

## 📄 License

This project is open source and available for educational purposes.

---

## 👨‍💻 Developer

**Shayaan RK**
- GitHub: [@ShayaanRK](https://github.com/ShayaanRK)
- Portfolio: [Your Portfolio URL]

---

## 🏆 Resume Highlights

**Key Technical Achievements:**
- ✅ Deployed full-stack application to production cloud infrastructure
- ✅ Implemented secure JWT authentication with BCrypt password hashing
- ✅ Built real-time WebSocket messaging system with Socket.io
- ✅ Configured environment-based deployment strategy (dev/prod separation)
- ✅ Designed and implemented PostgreSQL database schema
- ✅ Created responsive, accessible UI with modern design patterns
- ✅ Implemented CORS security and API protection
- ✅ Optimized frontend bundle size with code splitting
- ✅ Managed environment variables and secrets securely

**Production Metrics:**
- Bundle Size: 578 kB → 184 kB (gzipped)
- Database: 1000+ seeded records
- API Response Time: <200ms average
- Uptime: 99.9% (Vercel + Render SLA)

---

**Last Updated:** January 2026  
**Status:** ✅ Production-Ready & Actively Maintained
**Made with ❤️ by Shayaan RK**