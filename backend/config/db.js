import mongoose from 'mongoose';
import config from './config.js';

/**
 * Production-ready MongoDB connection
 * Supports both local MongoDB and MongoDB Atlas
 */
const connectDB = async () => {
    try {
        // Log connection attempt (hide credentials in production)
        const sanitizedUri = config.mongoUri.includes('@') 
            ? config.mongoUri.replace(/:([^:@]+)@/, ':****@')
            : config.mongoUri;
        
        console.log(`🔄 Connecting to MongoDB: ${sanitizedUri}`);
        
        const conn = await mongoose.connect(config.mongoUri, {
            // MongoDB Atlas recommended options
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Environment: ${config.env}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });

        // Graceful shutdown handlers
        const gracefulShutdown = async (signal) => {
            console.log(`\n${signal} received. Closing MongoDB connection...`);
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
            process.exit(0);
        };

        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

        return conn;
    } catch (error) {
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        
        // More helpful error messages
        if (error.message.includes('ECONNREFUSED')) {
            console.error('   → Is MongoDB running locally? Or did you set MONGODB_URI for Atlas?');
        } else if (error.message.includes('authentication failed')) {
            console.error('   → Check your MongoDB Atlas username and password');
        } else if (error.message.includes('getaddrinfo')) {
            console.error('   → Check your MongoDB Atlas cluster URL');
        }
        
        process.exit(1);
    }
};

export default connectDB;
