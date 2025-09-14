import express from 'express';
import { getMe, loginMember, logoutMember } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginMember);
router.post('/logout', protect, logoutMember);
router.get('/me', protect, getMe);

export default router;