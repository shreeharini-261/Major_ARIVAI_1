# ARIVAI - AI-Powered Menstrual Wellness App

## Overview
ARIVAI is a comprehensive menstrual wellness application featuring cycle tracking, personalized nutrition, meditation resources, and an AI chat companion.

## Local Development

### Prerequisites
- Node.js (v18+)
- Python (3.11+)
- PostgreSQL Database

### Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   pip install flask flask-cors flask-jwt-extended flask-sqlalchemy bcrypt google-generativeai psycopg2-binary python-dotenv
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/arivai
   SESSION_SECRET=your-secret-key
   GEMINI_API_KEY=your-google-gemini-api-key (optional)
   NODE_ENV=development
   ```

3. **Database Setup**:
   ```bash
   npm run db:push
   ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```
   The application will be available at: **http://localhost:5000**

   **Note**: Always access the application via port **5000**. Port 5001 is for the internal API only.

### Architecture
- **Frontend**: React (Vite) served via Express proxy.
- **Backend Proxy**: Express server on port 5000 (proxies `/api` to Flask).
- **API Server**: Flask on port 5001.

## Key Features
- **Cycle Tracking**: Visual calendar with phase indicators.
- **AI Chat Companion**: Personalized wellness advice powered by Google Gemini.
- **Phase-Based Nutrition**: Healthy recipes tailored to each cycle phase.
- **Meditation & Education**: Curated resources for reproductive health.

# ARIVAI - AI-Powered Menstrual Wellness App

## Overview
ARIVAI is a menstrual wellness application that provides cycle tracking, symptom logging, AI-powered chat, recipes, meditation videos, and educational content. It features personalized phase-based wellness guidance.

## Architecture
- **Frontend**: React + Vite (TypeScript), served on port 5000 via Express in dev mode
- **Express Server**: TypeScript server (`server/index.ts`) that proxies `/api/*` to Flask backend
- **Flask Backend**: Python (`backend/app.py`) running on port 5001 (localhost), handles all API logic
- **Database**: PostgreSQL with Drizzle ORM (Node.js side) and SQLAlchemy (Python side)
- **AI**: Google Gemini API for chat functionality (optional - app works without it)

## Project Structure
```
client/          - React frontend (Vite)
server/          - Express server (proxies to Flask)
backend/         - Flask API server
shared/          - Shared schema (Drizzle ORM)
script/          - Build scripts
```

## Key Files
- `server/index.ts` - Express entry point, serves on port 5000
- `server/routes.ts` - Proxies all /api/* to Flask on port 5001
- `backend/app.py` - Flask API with auth, cycles, symptoms, chat, recipes, etc.
- `shared/schema.ts` - Drizzle database schema
- `vite.config.ts` - Vite configuration (allowedHosts: true for Replit proxy)

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned)
- `SESSION_SECRET` - Session encryption key
- `GEMINI_API_KEY` - Google Gemini API key (optional)

## Scripts
- `npm run dev` - Start dev server (Express + Vite + Flask)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes

## Recent Changes
- Updated Onboarding with advanced phase logic (uterine/ovarian/life stages)
- Dashboard now shows buffer days and multiple phase breakdown
- Mocked phase-specific recipe recommendations in backend
- Updated README with local development instructions using .env
