import express from 'express';
import {
    getNotes,
    getNote,
    saveNote,
    deleteNote,
    syncNotes
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';
import { noteValidation } from '../validators/index.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getNotes);
router.post('/', noteValidation, saveNote);
router.post('/sync', syncNotes);
router.get('/:questionId', getNote);
router.delete('/:questionId', deleteNote);

export default router;
