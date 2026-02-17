import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

import config from './config/config.js';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './utils/errorHandler.js';

// Route imports
import {
    authRoutes,
    userRoutes,
    sheetRoutes,
    progressRoutes,
    noteRoutes
} from './routes/index.js';

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: config.isProduction ? undefined : false, // Disable CSP in development
}));

// Production-ready CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        
        // Build allowed origins list
        const allowedOrigins = [
            config.clientUrl,
            ...config.allowedOrigins
        ].filter(Boolean);
        
        // In development, also allow localhost variations
        if (!config.isProduction) {
            allowedOrigins.push(
                'http://localhost:5173',
                'http://localhost:5174',
                'http://localhost:5175',
                'http://localhost:3000',
                'http://127.0.0.1:5173',
                'http://127.0.0.1:5174',
                'http://127.0.0.1:5175'
            );
        }
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`⚠️ CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'], // For pagination
    maxAge: 86400 // Cache preflight for 24 hours
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
    message: {
        success: false,
        error: 'Too many requests, please try again later.'
    }
});
app.use('/api', limiter);

// Auth routes have stricter rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again later.'
    }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize data against NoSQL injection
app.use(mongoSanitize());

// Development logging
if (config.env === 'development') {
    app.use(morgan('dev'));
}

// Health check endpoint (used by deployment platforms)
app.get('/health', (req, res) => {
    const healthCheck = {
        success: true,
        message: 'CodeArena API is running',
        timestamp: new Date().toISOString(),
        environment: config.env,
        uptime: process.uptime(),
        memoryUsage: config.isProduction ? undefined : process.memoryUsage(),
    };
    
    res.status(200).json(healthCheck);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sheets', sheetRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notes', noteRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to CodeArena API',
        version: '1.0.0',
        endpoints: {
            auth: {
                'POST /api/auth/register': 'Register new user',
                'POST /api/auth/login': 'Login user',
                'POST /api/auth/logout': 'Logout user',
                'GET /api/auth/me': 'Get current user',
                'PUT /api/auth/updatedetails': 'Update user details',
                'PUT /api/auth/updatepassword': 'Update password'
            },
            users: {
                'GET /api/users/profile': 'Get user profile',
                'PUT /api/users/profile': 'Update profile',
                'GET /api/users/stats': 'Get user statistics',
                'GET /api/users/calendar': 'Get calendar data',
                'GET /api/users/achievements': 'Get achievements',
                'GET /api/users/submissions': 'Get submission history',
                'GET /api/users/leaderboard': 'Get leaderboard'
            },
            sheets: {
                'GET /api/sheets': 'Get all sheets',
                'GET /api/sheets/:slug': 'Get single sheet',
                'POST /api/sheets': 'Create custom sheet',
                'PUT /api/sheets/:slug': 'Update sheet',
                'DELETE /api/sheets/:slug': 'Delete sheet',
                'GET /api/sheets/:slug/stats': 'Get sheet statistics'
            },
            progress: {
                'GET /api/progress': 'Get all progress',
                'GET /api/progress/:sheetSlug': 'Get sheet progress',
                'POST /api/progress/:sheetSlug': 'Update progress',
                'POST /api/progress/sync': 'Sync all progress',
                'GET /api/progress/daily': 'Get daily progress',
                'GET /api/progress/export': 'Export progress as CSV'
            },
            notes: {
                'GET /api/notes': 'Get all notes',
                'GET /api/notes/:questionId': 'Get note',
                'POST /api/notes': 'Save note',
                'DELETE /api/notes/:questionId': 'Delete note',
                'POST /api/notes/sync': 'Sync all notes'
            }
        }
    });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;

const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 CodeArena API Server                             ║
║                                                       ║
║   Environment: ${config.env.padEnd(38)}║
║   Port: ${String(PORT).padEnd(45)}║
║   URL: http://localhost:${String(PORT).padEnd(29)}║
║                                                       ║
║   API Docs: http://localhost:${PORT}/api${' '.repeat(21)}║
║   Health: http://localhost:${PORT}/health${' '.repeat(18)}║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    process.exit(1);
});

export default app;
