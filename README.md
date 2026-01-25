# Erasmusly

A complete MERN stack web application for Erasmus students to find housing, roommates, and events.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, PostgreSQL (Native `pg` driver)
- **Real-time**: Socket.io

## Prerequisites
- Node.js installed
- PostgreSQL installed and running locally on port 5432 (Default)

## Project Setup / Getting Started

1.  **Install Dependencies**
    ```bash
    # Backend
    cd backend
    npm install
    
    # Frontend
    cd frontend
    npm install
    ```

2.  **Configure Environment**
    Ensure your `backend/.env` file is set up with your local PostgreSQL credentials:
    ```env
    DB_USER=postgres
    DB_PASSWORD=your_password
    DB_NAME=erasmusly
    DB_HOST=localhost
    DB_PORT=5432
    ```

3.  **Seed the Database (Important!)**
    Populate the database with realistic demo data (Users, Housing, Events):
    ```bash
    cd backend
    npm run seed
    ```

4.  **Run Application**
    Open two terminals:
    ```bash
    # Terminal 1 (Backend)
    cd backend
    npm run dev
    
    # Terminal 2 (Frontend)
    cd frontend
    npm run dev
    ```

## Demo Credentials
Use this account to immediately explore Chat, Housing, Events, and Dashboard features with pre-populated data.

- **Email**: `sophia@example.com`
- **Password**: `123456`

## Features
- **Auth**: Register/Login with JWT (BCrypt hashing).
- **Housing**: Browse seeded housing listings with images.
- **Matching**: Find roommates based on interests and city.
- **Chat**: Real-time messaging with roommates.
- **Events**: View upcoming local Erasmus events.