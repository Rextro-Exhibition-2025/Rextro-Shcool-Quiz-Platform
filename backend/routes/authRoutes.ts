import express from 'express';
import { loginMember, logoutMember } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginMember);
router.post('/logout', protect, logoutMember);

export default router;