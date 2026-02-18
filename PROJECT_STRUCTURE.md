# CodeArena Project Structure

## Overview
A full-stack MERN application for Data Structures & Algorithms (DSA) learning with gamification features.

## Directory Structure

```
codearena/
├── backend/                 # Node.js/Express backend API
│   ├── config/             # Configuration files
│   │   ├── config.js       # Environment & app config
│   │   └── db.js           # MongoDB Atlas connection
│   ├── controllers/        # Route controllers (business logic)
│   │   ├── authController.js
│   │   ├── noteController.js
│   │   ├── progressController.js
│   │   ├── sheetController.js
│   │   └── userController.js
│   ├── middleware/         # Express middleware
│   │   └── auth.js         # JWT authentication
│   ├── models/             # Mongoose schemas
│   │   ├── DailyProgress.js
│   │   ├── Note.js
│   │   ├── Progress.js
│   │   ├── Sheet.js
│   │   ├── Submission.js
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/             # API routes
│   │   ├── authRoutes.js
│   │   ├── noteRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── sheetRoutes.js
│   │   ├── userRoutes.js
│   │   └── index.js
│   ├── utils/              # Utility functions
│   │   ├── errorHandler.js
│   │   └── seeder.js       # Database seeding
│   ├── validators/         # Input validation
│   │   └── index.js
│   ├── .env.example        # Environment variables template
│   ├── .gitignore          # Backend-specific git ignores
│   ├── package.json        # Backend dependencies
│   ├── server.js           # Express app entry point
│   └── README.md           # Backend documentation
│
├── src/                    # React frontend source
│   ├── api/               # API client
│   │   ├── client.js      # Axios instance
│   │   └── ProblemsApi.js # Problem endpoints
│   ├── assets/            # Static assets
│   │   └── robot.json     # Lottie animation
│   ├── components/        # React components
│   │   ├── Achievements.jsx
│   │   ├── CompletionBadge.jsx
│   │   ├── ContributionCalendar.jsx
│   │   ├── DailyGraph.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── GamificationStats.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProgressChart.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── RobotChat.jsx
│   │   ├── SearchBar.jsx
│   │   ├── StreakCalendar.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── XPToast.jsx
│   ├── context/           # React Context (state management)
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── data/              # Problem sheets data
│   │   ├── companySheet.js
│   │   ├── leaderboard.js
│   │   ├── loveBabberSheet.js
│   │   ├── striverA2ZSheet.js
│   │   └── striverSheet.js
│   ├── pages/             # React pages/routes
│   │   ├── CompanySheet.jsx
│   │   ├── CreateSheet.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   ├── Sheet.jsx
│   │   └── SheetsList.jsx
│   ├── utils/             # Frontend utilities
│   │   ├── customSheets.js
│   │   ├── dailyProgress.js
│   │   ├── evaluater.js
│   │   ├── exportProgress.js
│   │   ├── gamification.js
│   │   ├── notes.js
│   │   ├── portfolioApi.js
│   │   ├── progressUtils.js
│   │   ├── storage.js
│   │   ├── theme.js
│   │   └── userProfile.js
│   ├── App.jsx            # Main App component
│   ├── firebase.js        # Firebase config
│   ├── index.css          # Global styles
│   ├── main.jsx           # React entry point
│   └── tailwind-input.css # Tailwind CSS config
│
├── public/                # Static assets
│   └── vite.svg
│
├── Config files
│   ├── .env               # Local environment variables (ignored)
│   ├── .env.example       # Environment template
│   ├── .env.production    # Production variables (ignored)
│   ├── .gitignore         # Git ignore rules
│   ├── eslint.config.js   # ESLint configuration
│   ├── postcss.config.cjs # PostCSS config
│   ├── tailwind.config.cjs # Tailwind CSS config
│   ├── vite.config.js     # Vite bundler config
│   ├── vercel.json        # Vercel deployment config
│   ├── render.yaml        # Render deployment config
│   ├── package.json       # Frontend dependencies
│   ├── package-lock.json  # Dependency lock file
│   ├── index.html         # HTML entry point
│   ├── README.md          # Project documentation
│   ├── CHANGELOG.md       # Version history
│   └── DEPLOYMENT.md      # Deployment guide
```

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB 8.0 (Atlas)
- **Authentication**: JWT with bcryptjs
- **Security**: Helmet, CORS, Rate Limiting, XSS Protection

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **Animations**: GSAP, Lottie
- **UI Components**: Custom components

### Deployment
- **Backend**: Render.com
- **Frontend**: Vercel
- **Database**: MongoDB Atlas

## Key Features
- 200+ DSA problems across multiple sheets
- JWT-based authentication
- Gamification system (XP, badges, achievements)
- Progress tracking & daily contribution graph
- Portfolio integration (GitHub, LeetCode, Codeforces)
- Dark/Light theme support
- Responsive design
- Notes & bookmarking

## .gitignore Rules
```
# Dependencies: node_modules/, package-lock.json
# Build: dist/, dist-ssr/, build/, *.local
# Environment: .env, .env.local, .env.*.local
# IDE: .vscode/, .idea/, *.swp, *.swo
# OS: .DS_Store, Thumbs.db
# Logs: logs/, *.log
```

## Installation & Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Frontend
```bash
npm install
npm run dev
```

### Database
- MongoDB Atlas connection configured in `backend/.env`
- Automatic schema creation via Mongoose
- Seeder available: `npm run seed`

## API Endpoints
30+ endpoints across:
- Auth (login, register, logout)
- Users (profile, stats, leaderboard)
- Sheets (CRUD operations)
- Progress (tracking, submissions)
- Notes (create, read, delete)

See `backend/routes/` for detailed endpoints.

---

**Last Updated**: February 18, 2026
**Deployed**: Render (backend) + Vercel (frontend) + MongoDB Atlas
