import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.js';
import Sheet from '../models/Sheet.js';

// Striver's SDE Sheet Data (sample)
const striverSdeSheet = {
    name: "Striver's SDE Sheet",
    slug: "striver-sde",
    description: "The most popular DSA sheet with 191+ handpicked problems covering all major topics for SDE interviews.",
    icon: "📘",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    image: "https://cdn-1.webcatalog.io/catalog/takeuforward/takeuforward-icon-filled-256.webp",
    type: "official",
    isPublic: true,
    topics: [
        {
            topic: "Arrays",
            order: 1,
            questions: [
                { title: "Set Matrix Zeros", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/set-matrix-zeroes", youtubeLink: "https://youtu.be/N0MgLvceX7M", order: 1 },
                { title: "Pascal's Triangle", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/pascals-triangle", youtubeLink: "https://youtu.be/bR7mQgwQ_o8", order: 2 },
                { title: "Next Permutation", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/next-permutation", youtubeLink: "https://youtu.be/JDOXKqF60RQ", order: 3 },
                { title: "Kadane's Algorithm", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/maximum-subarray", youtubeLink: "https://youtu.be/AHZpyENo7k4", order: 4 },
                { title: "Sort an array of 0's, 1's and 2's", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/sort-colors", order: 5 },
                { title: "Stock Buy and Sell", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock", order: 6 }
            ]
        },
        {
            topic: "Arrays Part-II",
            order: 2,
            questions: [
                { title: "Rotate Matrix", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/rotate-image", order: 1 },
                { title: "Merge Overlapping Subintervals", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/merge-intervals", order: 2 },
                { title: "Merge two sorted arrays", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/merge-sorted-array", order: 3 },
                { title: "Find the duplicate number", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/find-the-duplicate-number", order: 4 }
            ]
        },
        {
            topic: "Linked List",
            order: 3,
            questions: [
                { title: "Reverse a LinkedList", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/reverse-linked-list", order: 1 },
                { title: "Find the middle of LinkedList", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/middle-of-the-linked-list", order: 2 },
                { title: "Merge two sorted Linked Lists", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/merge-two-sorted-lists", order: 3 },
                { title: "Remove N-th node from back", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/remove-nth-node-from-end-of-list", order: 4 },
                { title: "Add two numbers as Linked List", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/add-two-numbers", order: 5 },
                { title: "Delete a given node in O(1)", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/delete-node-in-a-linked-list", order: 6 }
            ]
        },
        {
            topic: "Binary Search",
            order: 4,
            questions: [
                { title: "Binary Search", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/binary-search", order: 1 },
                { title: "Find First and Last Position", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array", order: 2 },
                { title: "Search in Rotated Sorted Array", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/search-in-rotated-sorted-array", order: 3 },
                { title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array", order: 4 }
            ]
        },
        {
            topic: "Recursion",
            order: 5,
            questions: [
                { title: "Subset Sums", difficulty: "Medium", gfgLink: "https://practice.geeksforgeeks.org/problems/subset-sums", order: 1 },
                { title: "Subset II", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/subsets-ii", order: 2 },
                { title: "Combination Sum", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/combination-sum", order: 3 },
                { title: "Combination Sum II", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/combination-sum-ii", order: 4 },
                { title: "Palindrome Partitioning", difficulty: "Hard", leetcodeLink: "https://leetcode.com/problems/palindrome-partitioning", order: 5 }
            ]
        },
        {
            topic: "Dynamic Programming",
            order: 6,
            questions: [
                { title: "Climbing Stairs", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/climbing-stairs", order: 1 },
                { title: "House Robber", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/house-robber", order: 2 },
                { title: "House Robber II", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/house-robber-ii", order: 3 },
                { title: "Longest Common Subsequence", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/longest-common-subsequence", order: 4 },
                { title: "Longest Increasing Subsequence", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/longest-increasing-subsequence", order: 5 },
                { title: "0/1 Knapsack", difficulty: "Medium", gfgLink: "https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem", order: 6 }
            ]
        },
        {
            topic: "Trees",
            order: 7,
            questions: [
                { title: "Inorder Traversal", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/binary-tree-inorder-traversal", order: 1 },
                { title: "Preorder Traversal", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/binary-tree-preorder-traversal", order: 2 },
                { title: "Postorder Traversal", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/binary-tree-postorder-traversal", order: 3 },
                { title: "Level Order Traversal", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/binary-tree-level-order-traversal", order: 4 },
                { title: "Maximum Depth of Binary Tree", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/maximum-depth-of-binary-tree", order: 5 },
                { title: "Balanced Binary Tree", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/balanced-binary-tree", order: 6 }
            ]
        },
        {
            topic: "Graphs",
            order: 8,
            questions: [
                { title: "Number of Islands", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/number-of-islands", order: 1 },
                { title: "Clone Graph", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/clone-graph", order: 2 },
                { title: "Course Schedule", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/course-schedule", order: 3 },
                { title: "Word Ladder", difficulty: "Hard", leetcodeLink: "https://leetcode.com/problems/word-ladder", order: 4 }
            ]
        }
    ]
};

// Striver A2Z Sheet (sample topics)
const striverA2ZSheet = {
    name: "Striver's A2Z DSA Sheet",
    slug: "striver-a2z",
    description: "Complete roadmap to master DSA from basics to advanced topics with 450+ problems.",
    icon: "🎯",
    color: "green",
    gradient: "from-green-500 to-emerald-500",
    type: "official",
    isPublic: true,
    topics: [
        {
            topic: "Learn the Basics",
            order: 1,
            questions: [
                { title: "Data types", difficulty: "Easy", order: 1 },
                { title: "If-else statements", difficulty: "Easy", order: 2 },
                { title: "Switch statements", difficulty: "Easy", order: 3 },
                { title: "Arrays and Strings", difficulty: "Easy", order: 4 },
                { title: "For loops", difficulty: "Easy", order: 5 },
                { title: "While loops", difficulty: "Easy", order: 6 },
                { title: "Functions", difficulty: "Easy", order: 7 }
            ]
        },
        {
            topic: "Sorting",
            order: 2,
            questions: [
                { title: "Selection Sort", difficulty: "Easy", order: 1 },
                { title: "Bubble Sort", difficulty: "Easy", order: 2 },
                { title: "Insertion Sort", difficulty: "Easy", order: 3 },
                { title: "Merge Sort", difficulty: "Medium", order: 4 },
                { title: "Quick Sort", difficulty: "Medium", order: 5 }
            ]
        },
        {
            topic: "Arrays [Easy]",
            order: 3,
            questions: [
                { title: "Largest Element in Array", difficulty: "Easy", order: 1 },
                { title: "Second Largest Element", difficulty: "Easy", order: 2 },
                { title: "Check if Array is Sorted", difficulty: "Easy", order: 3 },
                { title: "Remove Duplicates from Sorted Array", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/remove-duplicates-from-sorted-array", order: 4 },
                { title: "Left Rotate Array by One", difficulty: "Easy", order: 5 },
                { title: "Move Zeros to End", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/move-zeroes", order: 6 }
            ]
        },
        {
            topic: "Binary Search [1D Arrays]",
            order: 4,
            questions: [
                { title: "Binary Search", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/binary-search", order: 1 },
                { title: "Lower Bound", difficulty: "Easy", order: 2 },
                { title: "Upper Bound", difficulty: "Easy", order: 3 },
                { title: "Search Insert Position", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/search-insert-position", order: 4 },
                { title: "Floor and Ceil in Sorted Array", difficulty: "Easy", order: 5 }
            ]
        }
    ]
};

// Love Babbar Sheet (sample)
const loveBabbarSheet = {
    name: "Love Babbar 450 DSA Sheet",
    slug: "love-babbar",
    description: "Comprehensive list of 450 questions for in-depth DSA practice curated by Love Babbar.",
    icon: "💝",
    color: "rose",
    gradient: "from-rose-500 to-pink-500",
    type: "official",
    isPublic: true,
    topics: [
        {
            topic: "Array",
            order: 1,
            questions: [
                { title: "Reverse the array", difficulty: "Easy", order: 1 },
                { title: "Find the maximum and minimum element in an array", difficulty: "Easy", order: 2 },
                { title: "Find the Kth max and min element of an array", difficulty: "Medium", order: 3 },
                { title: "Sort an array of 0s, 1s and 2s", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/sort-colors", order: 4 },
                { title: "Move all negative numbers to beginning", difficulty: "Easy", order: 5 },
                { title: "Find the Union and Intersection of two sorted arrays", difficulty: "Easy", order: 6 }
            ]
        },
        {
            topic: "Matrix",
            order: 2,
            questions: [
                { title: "Spiral traversal on a Matrix", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/spiral-matrix", order: 1 },
                { title: "Search an element in a matrix", difficulty: "Medium", leetcodeLink: "https://leetcode.com/problems/search-a-2d-matrix", order: 2 },
                { title: "Find median in a row wise sorted matrix", difficulty: "Hard", order: 3 },
                { title: "Find row with maximum no. of 1's", difficulty: "Easy", order: 4 }
            ]
        },
        {
            topic: "String",
            order: 3,
            questions: [
                { title: "Reverse a String", difficulty: "Easy", leetcodeLink: "https://leetcode.com/problems/reverse-string", order: 1 },
                { title: "Check whether a String is Palindrome or not", difficulty: "Easy", order: 2 },
                { title: "Find Duplicate characters in a string", difficulty: "Easy", order: 3 },
                { title: "Check whether one string is a rotation of another", difficulty: "Easy", order: 4 }
            ]
        }
    ]
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
        await Sheet.create(striverSdeSheet);
        console.log('📘 Created Striver SDE Sheet');

        await Sheet.create(striverA2ZSheet);
        console.log('🎯 Created Striver A2Z Sheet');

        await Sheet.create(loveBabbarSheet);
        console.log('💝 Created Love Babbar Sheet');

        console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   ✅ Database seeding completed successfully!         ║
║                                                       ║
║   Created:                                            ║
║   - 2 users (admin + demo)                           ║
║   - 3 official sheets                                ║
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
