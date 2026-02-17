# CodeArena Backend

A robust Node.js/Express/MongoDB backend for the CodeArena DSA learning platform.

## Features

- 🔐 **JWT Authentication** - Secure user authentication with bcrypt password hashing
- 📊 **Progress Tracking** - Track problem-solving progress across multiple DSA sheets
- 📝 **Notes System** - Save and sync notes for each problem
- 🎮 **Gamification** - XP system, badges, achievements, and leaderboards
- 🛡️ **Security** - Rate limiting, CORS, XSS protection, MongoDB sanitization
- 📅 **Daily Streaks** - Track consecutive days of coding practice
- 📈 **Analytics** - Contribution calendar and progress statistics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose 8.0.3
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **Validation**: express-validator 7.0.1
- **Security**: helmet, cors, express-rate-limit, express-mongo-sanitize, xss-clean

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your settings:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/codearena
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   FRONTEND_URL=http://localhost:5173
   ```

5. Start the server:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

### Seeding Database

To populate the database with initial data (DSA sheets and demo users):

```bash
npm run seed
```

This creates:
- **Striver SDE Sheet** - 200+ problems
- **Striver A2Z DSA Sheet** - Comprehensive DSA curriculum
- **Love Babbar DSA Sheet** - 450+ problems
- **Admin User**: admin@codearena.com / admin123
- **Demo User**: demo@codearena.com / demo123

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/updatedetails` | Update user details |
| PUT | `/api/auth/updatepassword` | Update password |
| POST | `/api/auth/verify` | Verify JWT token |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/users/stats` | Get user statistics |
| GET | `/api/users/calendar` | Get activity calendar |
| GET | `/api/users/achievements` | Get achievements |
| GET | `/api/users/submissions` | Get submissions |
| GET | `/api/users/leaderboard` | Get leaderboard |

### Sheets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sheets` | Get all sheets |
| GET | `/api/sheets/:id` | Get single sheet |
| POST | `/api/sheets` | Create custom sheet |
| PUT | `/api/sheets/:id` | Update sheet |
| DELETE | `/api/sheets/:id` | Delete sheet |
| GET | `/api/sheets/search` | Search sheets |
| GET | `/api/sheets/:id/stats` | Get sheet stats |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress` | Get all progress |
| GET | `/api/progress/:sheetId` | Get sheet progress |
| PUT | `/api/progress/:sheetId` | Update progress |
| POST | `/api/progress/sync` | Sync all progress |
| GET | `/api/progress/daily` | Get daily progress |
| GET | `/api/progress/export` | Export progress as CSV |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes/:questionId` | Get single note |
| POST | `/api/notes` | Create/update note |
| DELETE | `/api/notes/:questionId` | Delete note |
| POST | `/api/notes/sync` | Sync all notes |

## Project Structure

```
backend/
├── config/
│   ├── config.js      # Environment configuration
│   └── db.js          # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── noteController.js
│   ├── progressController.js
│   ├── sheetController.js
│   └── userController.js
├── middleware/
│   └── auth.js        # JWT authentication middleware
├── models/
│   ├── DailyProgress.js
│   ├── Note.js
│   ├── Progress.js
│   ├── Sheet.js
│   ├── Submission.js
│   ├── User.js
│   └── index.js
├── routes/
│   ├── authRoutes.js
│   ├── index.js
│   ├── noteRoutes.js
│   ├── progressRoutes.js
│   ├── sheetRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── errorHandler.js # Error handling utilities
│   └── seeder.js       # Database seeder
├── validators/
│   └── index.js        # Request validation rules
├── .env
├── .env.example
├── package.json
└── server.js           # Main entry point
```

## Security Features

- **JWT Authentication** - Tokens expire after 30 days
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - 100 requests/15min (general), 10/15min (auth)
- **CORS** - Configured for frontend origin
- **XSS Protection** - xss-clean middleware
- **NoSQL Injection Prevention** - express-mongo-sanitize
- **HTTP Headers** - helmet middleware

## Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## License

MIT License - see LICENSE file for details.
