# Authentication Setup Guide

This guide explains how to set up Google OAuth authentication for Liahona Everyday.

## Overview

The app now uses **NextAuth.js v5** for authentication with Google OAuth. Each user gets their own isolated data (topics, roles, etc.).

## What Changed

### Backend Changes
- Added `user_id` column to all database tables (topics, roles)
- Updated all API routes to filter data by authenticated user
- Added automatic role initialization for new users
- Storage layers now require userId parameter

### Frontend Changes
- Removed fake auth (AuthGuard, AuthForm)
- Added NextAuth SessionProvider in root layout
- Created `/login` page with real Google OAuth
- Added middleware for route protection

## Setup Steps

### 1. Generate AUTH_SECRET

Generate a secure random string for JWT encryption:

```bash
openssl rand -base64 32
```

### 2. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select existing)
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Client ID:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "Liahona Everyday"

   **Authorized JavaScript origins:**
   - Development: `http://localhost:3000`
   - Production: `https://your-app.vercel.app`

   **Authorized redirect URIs:**
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-app.vercel.app/api/auth/callback/google`

5. Save your Client ID and Client Secret

### 3. Create .env.local for Development

Create `.env.local` in the project root:

```bash
# NextAuth Configuration
AUTH_SECRET="your-generated-secret-from-step-1"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id-from-google"
GOOGLE_CLIENT_SECRET="your-client-secret-from-google"

# Development URL
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configure Vercel Environment Variables

For production deployment:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following variables:
   - `AUTH_SECRET`: (same as local)
   - `GOOGLE_CLIENT_ID`: (from Google Console)
   - `GOOGLE_CLIENT_SECRET`: (from Google Console)
   - `NEXTAUTH_URL`: (your production URL, e.g., `https://your-app.vercel.app`)

### 5. Update Database Schema

The schema has been updated in `lib/db/schema.sql`. You need to run migrations:

**Option A: Fresh Database** (if you have no production data)
1. Delete existing data
2. Run the updated schema via Vercel dashboard or `/api/init` endpoint

**Option B: Migrate Existing Data**
Run these SQL commands in your Postgres database:

```sql
-- Add user_id columns
ALTER TABLE roles ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT 'migration-user';
ALTER TABLE topics ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT 'migration-user';

-- Update unique constraint for roles
ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_slug_key;
ALTER TABLE roles ADD CONSTRAINT roles_user_slug_unique UNIQUE(user_id, slug);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_topics_user_id ON topics(user_id);
CREATE INDEX IF NOT EXISTS idx_roles_user_id ON roles(user_id);

-- Optional: Assign existing data to a specific user ID
-- UPDATE topics SET user_id = 'your-google-user-id' WHERE user_id = 'migration-user';
-- UPDATE roles SET user_id = 'your-google-user-id' WHERE user_id = 'migration-user';
```

### 6. Test Locally

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`
3. You should be redirected to `/login`
4. Click "Continue with Google"
5. Sign in with your Google account
6. You should be redirected back and see the main app

### 7. Deploy to Production

1. Ensure all environment variables are set in Vercel
2. Ensure Google OAuth redirect URIs include your production domain
3. Deploy:
   ```bash
   vercel --prod
   ```

## How It Works

### Authentication Flow

1. User visits any protected route (e.g., `/`)
2. Middleware checks for valid session
3. If not authenticated, redirects to `/login`
4. User clicks "Continue with Google"
5. NextAuth redirects to Google OAuth
6. Google redirects back to `/api/auth/callback/google`
7. NextAuth creates session with user ID
8. User is redirected to original route

### User Isolation

- Each user gets their own set of roles initialized on first login
- All API routes extract `userId` from the NextAuth session
- Database queries filter by `user_id`
- Users can only see/modify their own data

### Default Roles

New users automatically get these 5 roles:
- 👤 Personal
- 💑 Marriage
- 👨‍👩‍👧‍👦 Parenting
- 📞 Calling
- 💼 Work

## Troubleshooting

### "Unauthorized" errors on API calls
- Check that AUTH_SECRET is set correctly
- Verify Google OAuth credentials are valid
- Check that NEXTAUTH_URL matches your domain

### Redirect loop
- Ensure `/login` is NOT protected by middleware
- Check that authorized callback in `auth.config.ts` is correct

### Google OAuth error: "redirect_uri_mismatch"
- Verify redirect URIs in Google Console exactly match your domain
- Include both development and production URLs

### Database errors
- Run the migration SQL commands
- Check that user_id columns exist in all tables

## Security Notes

- Never commit `.env.local` to git (it's in `.gitignore`)
- Rotate `AUTH_SECRET` periodically
- Use different Google OAuth credentials for dev and production
- Keep `GOOGLE_CLIENT_SECRET` secure in Vercel environment variables
