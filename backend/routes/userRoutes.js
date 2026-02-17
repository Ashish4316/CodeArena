import express from 'express';
import {
    getProfile,
    updateProfile,
    getUserStats,
    getCalendarData,
    getAchievements,
    getSubmissions,
    getLeaderboard,
    getAllUsers,
    updateUserRole
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { profileUpdateValidation, paginationValidation } from '../validators/index.js';

const router = express.Router();

// Public routes
router.get('/leaderboard', paginationValidation, getLeaderboard);

// Protected routes
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', profileUpdateValidation, updateProfile);
router.get('/stats', getUserStats);
router.get('/calendar', getCalendarData);
router.get('/achievements', getAchievements);
router.get('/submissions', paginationValidation, getSubmissions);

// Admin routes
router.get('/', authorize('admin'), paginationValidation, getAllUsers);
router.put('/:id/role', authorize('admin'), updateUserRole);

export default router;
