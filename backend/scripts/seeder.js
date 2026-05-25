import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.js';
import Sheet from '../models/Sheet.js';

import { striverSheet } from './data/striverSheet.js';
import { striverA2ZSheet } from './data/striverA2ZSheet.js';
import { loveBabberSheet } from './data/loveBabberSheet.js';
import { faangSheet } from './data/faangSheet.js';

const striverSdeSheetData = {
    name: "Striver's SDE Sheet",
    slug: "striver-sde",
    description: "The most popular DSA sheet with 191+ handpicked problems covering all major topics for SDE interviews.",
    icon: "📘",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    image: "https://cdn-1.webcatalog.io/catalog/takeuforward/takeuforward-icon-filled-256.webp",
    type: "official",
    isPublic: true,
    topics: striverSheet,
    totalQuestions: striverSheet.reduce((acc, topic) => acc + topic.questions.length, 0)
};

const striverA2ZSheetData = {
    name: "Striver's A2Z DSA Sheet",
    slug: "striver-a2z",
    description: "Complete roadmap to master DSA from basics to advanced topics with 450+ problems.",
    icon: "🎯",
    color: "green",
    gradient: "from-green-500 to-emerald-500",
    type: "official",
    isPublic: true,
    topics: striverA2ZSheet,
    totalQuestions: striverA2ZSheet.reduce((acc, topic) => acc + topic.questions.length, 0)
};

const loveBabbarSheetData = {
    name: "Love Babbar 450 DSA Sheet",
    slug: "love-babbar",
    description: "Comprehensive list of 450 questions for in-depth DSA practice curated by Love Babbar.",
    icon: "💝",
    color: "rose",
    gradient: "from-rose-500 to-pink-500",
    type: "official",
    isPublic: true,
    topics: loveBabberSheet,
    totalQuestions: loveBabberSheet.reduce((acc, topic) => acc + topic.questions.length, 0)
};

const faangSheetData = {
    name: "FAANG Interview Sheet",
    slug: "faang-sheet",
    description: "Top 100 most frequently asked interview questions by Meta, Apple, Amazon, Netflix, Google, and Microsoft.",
    icon: "🏢",
    color: "orange",
    gradient: "from-orange-500 to-red-500",
    type: "official",
    isPublic: true,
    topics: faangSheet,
    totalQuestions: faangSheet.reduce((acc, topic) => acc + topic.questions.length, 0)
};

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Sheet.deleteMany({});
        console.log('📦 Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin',
            email: 'admin@codearena.com',
            password: 'admin123',
            role: 'admin',
            gamification: {
                totalXP: 1000,
                level: 11,
                badges: ['first_blood', 'novice_coder', 'first_50', 'coding_master']
            }
        });
        console.log('👤 Created admin user');

        // Create demo user
        const demoUser = await User.create({
            name: 'Demo User',
            email: 'demo@codearena.com',
            password: 'demo123',
            handles: {
                leetcode: 'demouser',
                github: 'demouser'
            },
            gamification: {
                totalXP: 250,
                level: 3,
                badges: ['first_blood', 'novice_coder']
            }
        });
        console.log('👤 Created demo user');

        // Seed sheets
        await Sheet.create(striverSdeSheetData);
        console.log('📘 Created Striver SDE Sheet');

        await Sheet.create(striverA2ZSheetData);
        console.log('🎯 Created Striver A2Z Sheet');

        await Sheet.create(loveBabbarSheetData);
        console.log('💝 Created Love Babbar Sheet');

        await Sheet.create(faangSheetData);
        console.log('🏢 Created FAANG Sheet');

        console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   ✅ Database seeding completed successfully!         ║
║                                                       ║
║   Created:                                            ║
║   - 2 users (admin + demo)                           ║
║   - 4 official sheets                                ║
║                                                       ║
║   Login credentials:                                  ║
║   Admin: admin@codearena.com / admin123              ║
║   Demo:  demo@codearena.com / demo123                ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
        `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

// Run seeder
seedDatabase();
