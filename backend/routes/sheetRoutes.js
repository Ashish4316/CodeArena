import express from 'express';
import {
    getSheets,
    getSheet,
    createSheet,
    updateSheet,
    deleteSheet,
    getSheetStats,
    searchSheets
} from '../controllers/sheetController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { sheetValidation, paginationValidation } from '../validators/index.js';

const router = express.Router();

// Public routes with optional auth
router.get('/', optionalAuth, paginationValidation, getSheets);
router.get('/search', searchSheets);
router.get('/:slug', optionalAuth, getSheet);
router.get('/:slug/stats', getSheetStats);

// Protected routes
router.use(protect);
router.post('/', sheetValidation, createSheet);
router.put('/:slug', updateSheet);
router.delete('/:slug', deleteSheet);

export default router;
