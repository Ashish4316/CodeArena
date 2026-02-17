# CodeArena Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-XX-XX

### Added

#### Backend (New!)
- **Complete Node.js/Express/MongoDB Backend**
  - Full REST API with proper MVC architecture
  - JWT-based authentication system
  - bcrypt password hashing
  - Rate limiting (100 req/15min general, 10/15min for auth)
  - Security middleware (helmet, cors, xss-clean, mongo-sanitize)
  - Request validation with express-validator

- **Database Models**
  - `User` - User accounts with gamification stats
  - `Sheet` - DSA sheets (official & custom)
  - `Progress` - Problem-solving progress tracking
  - `DailyProgress` - Daily streak tracking
  - `Note` - Personal notes for problems
  - `Submission` - Code submissions (future feature)

- **API Endpoints**
  - Auth: register, login, logout, verify token, update password
  - Users: profile, stats, calendar, achievements, leaderboard
  - Sheets: CRUD, search, stats
  - Progress: get/update, sync, daily progress, export CSV
  - Notes: CRUD, sync

- **Database Seeder**
  - Pre-populated DSA sheets (Striver SDE, A2Z, Love Babbar)
  - Demo users for testing

#### Frontend Enhancements
- **API Client** (`src/api/client.js`)
  - Complete API wrapper for backend communication
  - Token management with localStorage
  - Error handling and retry logic

- **Backend Integration**
  - `AuthContext` - Dual mode (Backend API + Firebase fallback)
  - `Navbar` - Uses AuthContext for user state
  - `Profile` - Syncs with backend API
  - `DashboardPage` - Fetches stats from backend
  - `QuestionCard` - Syncs progress and notes to backend

- **Environment Configuration**
  - `.env` files for both frontend and backend
  - Environment variable support in firebase.js

### Changed
- `AuthContext.jsx` - Complete rewrite with backend integration
- `Navbar.jsx` - Uses AuthContext instead of mock data
- `Register.jsx` - Added name field for registration
- `Profile.jsx` - Dual mode (backend + localStorage fallback)
- `DashboardPage.jsx` - Fetches from backend when available
- `QuestionCard.jsx` - Syncs progress/notes to backend

### Security Improvements
- Firebase API keys now use environment variables
- JWT authentication with secure token storage
- Password hashing with bcrypt (12 salt rounds)
- XSS protection middleware
- NoSQL injection prevention
- HTTP security headers

### Documentation
- Updated main `README.md` with full project documentation
- Added `backend/README.md` with API documentation
- Created `CHANGELOG.md` (this file)

## [1.0.0] - Previous Version

### Features
- React 19 frontend with Vite
- Firebase Authentication (email/password)
- LocalStorage-based progress tracking
- DSA sheets (Striver, Love Babbar)
- Custom sheet creation
- Gamification (XP, badges, achievements)
- Dark/light theme support
- Contribution calendar
- Notes system
- Portfolio page

---

## Migration Guide

### From v1.0 to v2.0

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   - Copy `backend/.env.example` to `backend/.env`
   - Set your MongoDB URI and JWT secret
   - Copy `.env.example` to `.env` in root for frontend

3. **Seed Database** (optional)
   ```bash
   cd backend
   npm run seed
   ```

4. **Run Both Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

5. **Data Migration**
   - Existing localStorage data will automatically sync to backend on first login
   - Firebase users can continue using Firebase auth as fallback

### Breaking Changes
- None (fully backward compatible with localStorage/Firebase fallback)
