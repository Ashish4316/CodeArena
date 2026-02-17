import dotenv from 'dotenv';
dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,

    // MongoDB
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena',

    // JWT
    jwtSecret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    jwtCookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 30,

    // Rate Limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,

    // CORS
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

export default config;
