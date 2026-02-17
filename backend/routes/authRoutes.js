import express from 'express';
import {
    register,
    login,
    logout,
    getMe,
    updateDetails,
    updatePassword,
    verifyToken
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerValidation, loginValidation, profileUpdateValidation } from '../validators/index.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.use(protect);
router.post('/logout', logout);
router.get('/me', getMe);
router.get('/verify', verifyToken);
router.put('/updatedetails', profileUpdateValidation, updateDetails);
router.put('/updatepassword', updatePassword);

export default router;
