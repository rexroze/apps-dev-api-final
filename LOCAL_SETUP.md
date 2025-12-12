# Local Development Setup Guide

This guide will help you set up your backend for local development.

## Quick Start

### 1. Create `.env` File

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

### 2. Required Environment Variables

Edit your `.env` file with these values:

#### Database
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
```
Or use a cloud database like Neon:
```env
DATABASE_URL="your_neon_connection_string_here"
```

#### Server & Frontend
```env
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### JWT Secrets
Generate strong random strings:
```env
JWT_ACCESS_SECRET=your_very_long_random_secret_here
JWT_REFRESH_SECRET=your_very_long_random_secret_here
```

#### OAuth (Google)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:8000/api/auth/v1/google/callback`
4. Copy Client ID and Secret:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/v1/google/callback
```

#### OAuth (GitHub)
1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:8000/api/auth/v1/github/callback`
4. Copy Client ID and Secret:

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:8000/api/auth/v1/github/callback
```

#### Email (Optional - for email verification)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=noreply@yourapp.com
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:8000`

## Frontend Setup

Make sure your frontend `.env.local` has:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then start the frontend:

```bash
cd ../frontend
npm install
npm run dev
```

Frontend will be at `http://localhost:3000`

## Testing OAuth Locally

1. Make sure both backend (port 8000) and frontend (port 3000) are running
2. Go to `http://localhost:3000/login`
3. Click "Sign in with Google" or "Sign in with GitHub"
4. After authentication, you'll be redirected back to `http://localhost:3000/oauth-callback`

## Troubleshooting

### OAuth redirect_uri_mismatch Error

Make sure:
- `GOOGLE_CALLBACK_URL` in `.env` is exactly: `http://localhost:8000/api/auth/v1/google/callback`
- The same URL is added in Google Cloud Console → OAuth 2.0 Client → Authorized redirect URIs

### Database Connection Error

- Check your `DATABASE_URL` is correct
- Make sure your database is running (if local PostgreSQL)
- For cloud databases, check the connection string includes SSL if required

### Port Already in Use

If port 8000 is taken:
- Change `PORT=8000` to another port in `.env`
- Update frontend `NEXT_PUBLIC_API_URL` to match

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:deploy
```

## Need Help?

- Check the main README.md for more details
- Check Prisma documentation: https://www.prisma.io/docs
- Check Express documentation: https://expressjs.com/

