import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from '../config/db.js';
import Sheet from '../models/Sheet.js';
import { faangSheet } from './data/faangSheet.js';

const faangSheetData = {
    name: "FAANG Interview Sheet",
    slug: "faang-sheet",
    description: "Top 100 most frequently asked interview questions by Meta, Apple, Amazon, Netflix, Google, and Microsoft.",
    icon: "🏢",
    color: "orange",
    gradient: "from-orange-500 to-red-500",
    type: "official",
    isPublic: true,
    topics: faangSheet.topics,
    totalQuestions: faangSheet.topics.reduce((acc, topic) => acc + topic.questions.length, 0)
};

const seedFaang = async () => {
    try {
        await connectDB();
        console.log('🌱 Starting database seeding for FAANG Sheet...');

        // Delete existing faang sheet if any
        await Sheet.deleteOne({ slug: 'faang-sheet' });
        console.log('📦 Cleared existing FAANG sheet');

        // Seed FAANG sheet
        await Sheet.create(faangSheetData);
        console.log('🏢 Created FAANG Sheet successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedFaang();
