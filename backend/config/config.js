import dotenv from 'dotenv';
dotenv.config();

/**
 * Production-ready configuration
 * All sensitive values MUST be set via environment variables in production
 */

const isProduction = process.env.NODE_ENV === 'production';

// Validate required environment variables in production
const validateEnv = () => {
    const required = ['MONGODB_URI', 'JWT_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (isProduction && missing.length > 0) {
        console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
    
    // Warn about insecure defaults in development
    if (!isProduction) {
        if (!process.env.JWT_SECRET) {
            console.warn('⚠️  WARNING: Using default JWT_SECRET. Set a secure secret in production!');
        }
        if (!process.env.MONGODB_URI) {
            console.warn('⚠️  WARNING: Using local MongoDB. Set MONGODB_URI for MongoDB Atlas in production!');
        }
    }
};

validateEnv();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    isProduction,

    // MongoDB - REQUIRED in production
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena',

    // JWT - REQUIRED in production
    jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_in_production_immediately',
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    jwtCookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 30,

    // Rate Limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || (isProduction ? 100 : 1000), // Stricter in production

    // CORS - supports multiple origins for production
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    
    // Additional allowed origins (comma-separated in env)
    allowedOrigins: process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim())
        : [],
};

export default config;
