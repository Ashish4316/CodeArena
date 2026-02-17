import express from 'express';
import {
    getProgress,
    getAllProgress,
    updateProgress,
    syncProgress,
    getDailyProgress,
    exportProgress
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';
import { progressValidation } from '../validators/index.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getAllProgress);
router.get('/daily', getDailyProgress);
router.get('/export', exportProgress);
router.post('/sync', syncProgress);
router.get('/:sheetSlug', getProgress);
router.post('/:sheetSlug', progressValidation, updateProgress);

export default router;
