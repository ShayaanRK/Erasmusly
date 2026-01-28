-- ============================================
-- Erasmusly PostgreSQL Database Schema
-- Compatible with Supabase
-- ============================================
-- 
-- This schema is derived from the production codebase
-- and matches all queries in controllers and seed files.
-- 
-- Run this ONCE in Supabase SQL Editor before seeding.
-- ============================================

-- Drop existing tables (if re-running)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chat_room_participants CASCADE;
DROP TABLE IF EXISTS chat_rooms CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS housing_posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- TABLE: users
-- ============================================
-- Stores user accounts and profiles
-- Used by: authentication, matching, all protected endpoints
-- ============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    university VARCHAR(255),
    city VARCHAR(255),
    country VARCHAR(255),
    budget_range VARCHAR(50),
    interests TEXT[],
    bio TEXT,
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster email lookups (login, registration)
CREATE INDEX idx_users_email ON users(email);

-- Index for matching algorithm (city-based queries)
CREATE INDEX idx_users_city ON users(city);

-- ============================================
-- TABLE: housing_posts
-- ============================================
-- Stores housing listings created by users
-- Used by: housing controller, housing API
-- ============================================

CREATE TABLE housing_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address TEXT,
    images TEXT[],
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for filtering by city
CREATE INDEX idx_housing_city ON housing_posts(city);

-- Index for filtering by price range
CREATE INDEX idx_housing_price ON housing_posts(price);

-- Index for user's own posts
CREATE INDEX idx_housing_user_id ON housing_posts(user_id);

-- ============================================
-- TABLE: events
-- ============================================
-- Stores events created by users
-- Used by: event controller, events API
-- ============================================

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for filtering upcoming events
CREATE INDEX idx_events_date ON events(event_date);

-- Index for user's own events
CREATE INDEX idx_events_user_id ON events(user_id);

-- ============================================
-- TABLE: chat_rooms
-- ============================================
-- Stores chat rooms between users
-- Used by: chat controller, messaging system
-- ============================================

CREATE TABLE chat_rooms (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for sorting chats by last activity
CREATE INDEX idx_chat_rooms_updated_at ON chat_rooms(updated_at DESC);

-- ============================================
-- TABLE: chat_room_participants
-- ============================================
-- Junction table for many-to-many relationship
-- between users and chat rooms
-- Used by: chat controller, access control
-- ============================================

CREATE TABLE chat_room_participants (
    id SERIAL PRIMARY KEY,
    chat_room_id INTEGER NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(chat_room_id, user_id)
);

-- Index for finding user's chats
CREATE INDEX idx_participants_user_id ON chat_room_participants(user_id);

-- Index for finding chat participants
CREATE INDEX idx_participants_chat_room_id ON chat_room_participants(chat_room_id);

-- Composite index for checking if chat exists between two users
CREATE INDEX idx_participants_lookup ON chat_room_participants(chat_room_id, user_id);

-- ============================================
-- TABLE: messages
-- ============================================
-- Stores individual messages in chat rooms
-- Used by: chat controller, message API
-- ============================================

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_room_id INTEGER NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fetching messages by chat room (chronological order)
CREATE INDEX idx_messages_chat_room_id ON messages(chat_room_id, created_at);

-- Index for user's sent messages
CREATE INDEX idx_messages_user_id ON messages(user_id);

-- ============================================
-- TRIGGERS: Auto-update timestamps
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to housing_posts table
CREATE TRIGGER update_housing_posts_updated_at
    BEFORE UPDATE ON housing_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to events table
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to chat_rooms table
CREATE TRIGGER update_chat_rooms_updated_at
    BEFORE UPDATE ON chat_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after schema creation to verify:
-- ============================================

-- Check all tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;

-- Check all columns in users table
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'users';

-- Verify foreign key constraints
-- SELECT
--     tc.table_name, 
--     kcu.column_name, 
--     ccu.table_name AS foreign_table_name,
--     ccu.column_name AS foreign_column_name 
-- FROM information_schema.table_constraints AS tc 
-- JOIN information_schema.key_column_usage AS kcu
--     ON tc.constraint_name = kcu.constraint_name
-- JOIN information_schema.constraint_column_usage AS ccu
--     ON ccu.constraint_name = tc.constraint_name
-- WHERE tc.constraint_type = 'FOREIGN KEY';

-- ============================================
-- SCHEMA CREATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Run this schema in Supabase SQL Editor
-- 2. Verify all tables created successfully
-- 3. Run seedDatabase.js to populate data
-- 4. Test all API endpoints
-- ============================================
