# 🎯 CodeArena

CodeArena is a comprehensive full-stack platform designed for developers to track their Data Structures and Algorithms (DSA) progress, manage personalized question sheets, and visualize their journey towards mastering technical interviews.

## 🚀 Features

### Core Features
- **DSA Sheets Integration**: Access popular sheets like Striver SDE, A2Z, and Love Babbar directly within the platform
- **Custom Sheet Creation**: Create and manage your own personalized question sheets tailored to your goals
- **Interactive Dashboard**: Visualize your progress with dynamic charts, activity maps, and achievement tracking
- **Company-Specific Prep**: Filter and focus on questions frequently asked by top tech companies
- **Progress Tracking**: Mark problems as solved and track your daily progress
- **Notes System**: Add personal notes to each problem for future reference

### Gamification
- **XP System**: Earn experience points for solving problems
- **Achievements & Badges**: Unlock badges for completing milestones
- **Streak Tracking**: Maintain daily coding streaks
- **Leaderboard**: Compare progress with other users

### Portfolio
- **Personal Portfolio Page**: Showcase your coding journey
- **Platform Integration**: Link your LeetCode, GitHub, Codeforces, and Codolio profiles
- **Progress Statistics**: Display solved problems, streaks, and achievements

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **Vite 7** - Build Tool & Dev Server
- **Tailwind CSS 4** - Utility-first CSS Framework
- **React Router Dom v7** - Client-side Routing
- **GSAP** - Animation Library
- **Lottie-react** - Animated Icons
- **Vite** - Lightning fast build tool

### Backend (New!)
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/codearena.git
   cd codearena
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

4. **Set up Environment Variables**:

   Create `.env` in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   Create `.env` in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/codearena
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:5173
   ```

5. **Seed the database** (optional):
   ```bash
   cd backend
   npm run seed
   ```
   This creates demo users and DSA sheets.

6. **Run the application**:

   In one terminal (backend):
   ```bash
   cd backend
   npm run dev
   ```

   In another terminal (frontend):
   ```bash
   npm run dev
   ```

7. **Open your browser**:
   Navigate to `http://localhost:5173`

### Demo Credentials
After running the seed script:
- **Admin**: admin@codearena.com / admin123
- **Demo User**: demo@codearena.com / demo123

## 🏗️ Project Structure

```
codearena/
├── src/                    # Frontend source
│   ├── api/                # API client
│   ├── assets/             # Static assets
│   ├── components/         # Reusable UI components
│   ├── context/            # React Context (Auth, Theme)
│   ├── data/               # DSA sheet data
│   ├── pages/              # Page components
│   ├── styles/             # CSS/styles
│   └── utils/              # Helper functions
├── backend/                # Backend source
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utilities
│   └── validators/         # Request validators
├── public/                 # Public assets
└── package.json
```

## 📚 API Documentation

See [Backend README](./backend/README.md) for detailed API documentation.

### Quick API Reference

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | Register new user |
| `POST /api/auth/login` | Login user |
| `GET /api/sheets` | Get all DSA sheets |
| `GET /api/progress` | Get user progress |
| `PUT /api/progress/:sheetId` | Update progress |
| `GET /api/notes` | Get user notes |

## 🔒 Security Features

- JWT Authentication with token expiration
- Password hashing with bcrypt
- Rate limiting (100 req/15min, 10 for auth)
- CORS protection
- XSS prevention
- NoSQL injection prevention
- HTTP security headers (Helmet)

## 🎨 Screenshots

Coming soon...

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

- **Ashish Kumar Yadav**

## 🙏 Acknowledgments

- [Striver](https://takeuforward.org/) for the amazing DSA sheets
- [Love Babbar](https://www.youtube.com/@LoveBabbar) for the comprehensive DSA content
- All the open-source libraries used in this project

